<script setup lang="ts">
import { ref } from "vue";
import { Settings } from "@classes/database/settings.ts";
import { SettingsServices } from "../services/settingsServices.ts";

type SwitchSettingKey =
	| "doubleTaskSignOff"
	| "employeeSignOff"
	| "allowClockInOut"
	| "automaticShiftTrades"
	| "enableOpenShift"
	| "enableShiftTrades";

type NumberSettingKey = "clockInThreshold" | "onTimeThreshold";

const businessID = 1;

const settings = ref<Settings | null>(null);
const isLoading = ref(true);
const isSaving = ref(false);
const statusMessage = ref("");

const switchFields: Array<{
	key: SwitchSettingKey;
	label: string;
	description: string;
}> = [
	{
		key: "doubleTaskSignOff",
		label: "Double Task Sign Off",
		description:
			"Require two sign offs before a task is marked complete.",
	},
	{
		key: "employeeSignOff",
		label: "Employee Sign Off",
		description:
			"Require employee confirmation for completed work on a shift.",
	},
	{
		key: "allowClockInOut",
		label: "Allow Clock In/Out",
		description: "Enable time tracking actions for staff.",
	},
	{
		key: "automaticShiftTrades",
		label: "Automatic Shift Trades",
		description:
			"Automatically approve eligible shift trade requests.",
	},
	{
		key: "enableOpenShift",
		label: "Enable Open Shift",
		description: "Allow publishing shifts to the open-shift board.",
	},
	{
		key: "enableShiftTrades",
		label: "Enable Shift Trades",
		description: "Allow employees to request shift trades.",
	},
];

const numberFields: Array<{
	key: NumberSettingKey;
	label: string;
	description: string;
	min: number;
}> = [
	{
		key: "clockInThreshold",
		label: "Clock In Threshold (minutes)",
		description:
			"How many minutes early/late are allowed when clocking in.",
		min: 0,
	},
	{
		key: "onTimeThreshold",
		label: "On-Time Threshold (minutes)",
		description:
			"Grace period before an employee is marked as late.",
		min: 0,
	},
];

const getSwitchValue = (key: SwitchSettingKey): boolean => {
	if (!settings.value) {
		return false;
	}

	return settings.value[key];
};

const setSwitchValue = (key: SwitchSettingKey, value: boolean) => {
	if (!settings.value) {
		return;
	}

	settings.value[key] = value;
};

const getNumberValue = (key: NumberSettingKey): number => {
	if (!settings.value) {
		return 0;
	}

	return settings.value[key];
};

const setNumberValue = (key: NumberSettingKey, value: number) => {
	if (!settings.value) {
		return;
	}

	settings.value[key] = value;
};

const loadSettings = async () => {
	isLoading.value = true;
	statusMessage.value = "";

	try {
		settings.value = await SettingsServices.getOrCreateDefault(businessID);
	} catch (err) {
		console.error("Failed to load settings", err);
		statusMessage.value = "Unable to load settings.";
	} finally {
		isLoading.value = false;
	}
};

const saveSettings = async () => {
	if (!settings.value) {
		return;
	}

	isSaving.value = true;
	statusMessage.value = "";

	try {
		await SettingsServices.save(settings.value);
		statusMessage.value = "Settings saved.";
	} catch (err) {
		console.error("Failed to save settings", err);
		statusMessage.value = "Failed to save settings.";
	} finally {
		isSaving.value = false;
	}
};

loadSettings();
</script>

<template>
	<div class="settings-page">
		<SettingsContainer
			title="Scheduling Settings"
			description="Configure behavior for time tracking, shift trades, and approvals."
		>
			<div v-if="isLoading" class="text-sm">Loading settings...</div>

			<template v-else-if="settings">
				<SettingSwitchRow
					v-for="field in switchFields"
					:key="field.key"
					:label="field.label"
					:description="field.description"
					:model-value="getSwitchValue(field.key)"
					@update:model-value="setSwitchValue(field.key, $event)"
				/>

				<USeparator />

				<SettingNumberRow
					v-for="field in numberFields"
					:key="field.key"
					:label="field.label"
					:description="field.description"
					:model-value="getNumberValue(field.key)"
					:min="field.min"
					@update:model-value="setNumberValue(field.key, $event)"
				/>

				<div class="actions">
					<UButton
						:loading="isSaving"
						:disabled="isSaving"
						@click="saveSettings"
					>
						Save Settings
					</UButton>
					<span v-if="statusMessage" class="text-sm">{{ statusMessage }}</span>
				</div>
			</template>
		</SettingsContainer>
	</div>
</template>

<style scoped>
.settings-page {
	display: grid;
	padding: 1.5rem;
}

.actions {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-top: 0.5rem;
}
</style>