<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { computed, ref } from "vue";
import * as v from "valibot";
import { useColorMode } from "@vueuse/core";
import { Settings } from "@classes/database/settings.ts";
import { SettingsServices } from "../services/settingsServices.ts";
import { Store } from "@classes/util/store/store.ts";

type SwitchSettingKey =
    | "doubleTaskSignOff"
    | "employeeSignOff"
    | "allowClockInOut"
    | "automaticShiftTrades"
    | "enableOpenShift"
    | "enableShiftTrades";

type NumberSettingKey = "clockInThreshold" | "onTimeThreshold";

type SettingsFormState = {
	doubleTaskSignOff: boolean;
	employeeSignOff: boolean;
	allowClockInOut: boolean;
	automaticShiftTrades: boolean;
	enableOpenShift: boolean;
	enableShiftTrades: boolean;
	clockInThreshold: number;
	onTimeThreshold: number;
};

const settingsFormSchema = v.pipe(
	v.object({
		doubleTaskSignOff: v.boolean(),
		employeeSignOff: v.boolean(),
		allowClockInOut: v.boolean(),
		automaticShiftTrades: v.boolean(),
		enableOpenShift: v.boolean(),
		enableShiftTrades: v.boolean(),
		clockInThreshold: v.number(),
		onTimeThreshold: v.number(),
	}),
	v.forward(
		v.check(
			(data) => Number.isFinite(data.clockInThreshold),
			"Clock In Threshold must be a valid number.",
		),
		["clockInThreshold"],
	),
	v.forward(
		v.check(
			(data) => Number.isInteger(data.clockInThreshold),
			"Clock In Threshold must be a whole number.",
		),
		["clockInThreshold"],
	),
	v.forward(
		v.check(
			(data) => data.clockInThreshold >= 0,
			"Clock In Threshold cannot be negative.",
		),
		["clockInThreshold"],
	),
	v.forward(
		v.check(
			(data) => Number.isFinite(data.onTimeThreshold),
			"On-Time Threshold must be a valid number.",
		),
		["onTimeThreshold"],
	),
	v.forward(
		v.check(
			(data) => Number.isInteger(data.onTimeThreshold),
			"On-Time Threshold must be a whole number.",
		),
		["onTimeThreshold"],
	),
	v.forward(
		v.check(
			(data) => data.onTimeThreshold >= 0,
			"On-Time Threshold cannot be negative.",
		),
		["onTimeThreshold"],
	),
);
type SettingsValidationSchema = v.InferOutput<typeof settingsFormSchema>;

const businessID = 1;

const settings = ref<Settings | null>(null);
const formState = ref<SettingsFormState>({
	doubleTaskSignOff: false,
	employeeSignOff: false,
	allowClockInOut: true,
	automaticShiftTrades: false,
	enableOpenShift: false,
	enableShiftTrades: false,
	clockInThreshold: 0,
	onTimeThreshold: 0,
});
const isLoading = ref(true);
const isSaving = ref(false);
const statusMessage = ref("");
const statusTone = ref<"success" | "error" | null>(null);
const initialSettingsSignature = ref("");
const colorMode = useColorMode();

const darkModeEnabled = computed({
    get: () => colorMode.value === "dark",
    set: (isDark: boolean) => {
        colorMode.value = isDark ? "dark" : "light";
    },
});

const hasUnsavedChanges = computed(() => {
	if (!settings.value || !initialSettingsSignature.value) {
		return false;
	}

	return JSON.stringify(formState.value) !== initialSettingsSignature.value;
});

const switchFields: Array<{
    key: SwitchSettingKey;
    label: string;
    description: string;
}> = [
    {
        key: "doubleTaskSignOff",
        label: "Double Task Sign Off",
        description: "Require two sign offs before a task is marked complete.",
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
        description: "Automatically approve eligible shift trade requests.",
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
        description: "Grace period before an employee is marked as late.",
        min: 0,
    },
];

const getSwitchValue = (key: SwitchSettingKey): boolean => {
	return formState.value[key];
};

const setSwitchValue = (key: SwitchSettingKey, value: boolean) => {
	formState.value[key] = value;
};

const getNumberValue = (key: NumberSettingKey): number => {
	return formState.value[key];
};

const setNumberValue = (key: NumberSettingKey, value: number) => {
	formState.value[key] = value;
};

const setFormStateFromSettings = (loadedSettings: Settings) => {
	formState.value = {
		doubleTaskSignOff: loadedSettings.doubleTaskSignOff,
		employeeSignOff: loadedSettings.employeeSignOff,
		allowClockInOut: loadedSettings.allowClockInOut,
		automaticShiftTrades: loadedSettings.automaticShiftTrades,
		enableOpenShift: loadedSettings.enableOpenShift,
		enableShiftTrades: loadedSettings.enableShiftTrades,
		clockInThreshold: loadedSettings.clockInThreshold,
		onTimeThreshold: loadedSettings.onTimeThreshold,
	};
};

const loadSettings = async () => {
	isLoading.value = true;
	statusMessage.value = "";
	statusTone.value = null;

	try {
		settings.value = await SettingsServices.getOrCreateDefault(businessID);
		setFormStateFromSettings(settings.value);
		initialSettingsSignature.value = JSON.stringify(formState.value);
	} catch (err) {
		console.error("Failed to load settings", err);
		statusMessage.value = "Unable to load settings.";
		statusTone.value = "error";
	} finally {
		isLoading.value = false;
	}
};

const saveSettings = async (_event: FormSubmitEvent<SettingsValidationSchema>) => {
	if (!settings.value) {
		return;
	}

	isSaving.value = true;
	statusMessage.value = "";
	statusTone.value = null;

	try {
		const updatedSettings = new Settings(
			settings.value.businessID,
			formState.value.doubleTaskSignOff,
			formState.value.employeeSignOff,
			formState.value.allowClockInOut,
			formState.value.clockInThreshold,
			formState.value.onTimeThreshold,
			formState.value.automaticShiftTrades,
			formState.value.enableOpenShift,
			formState.value.enableShiftTrades,
		);

		await SettingsServices.save(updatedSettings);
		settings.value = updatedSettings;
		statusMessage.value = "Settings saved.";
		statusTone.value = "success";
		initialSettingsSignature.value = JSON.stringify(formState.value);
	} catch (err) {
		console.error("Failed to save settings", err);
		statusMessage.value = "Failed to save settings.";
		statusTone.value = "error";
	} finally {
		isSaving.value = false;
	}
};

loadSettings();
</script>

<template>
	<div class="settings-page">
		<SettingsContainer
			title="Browser Settings"
			description="Settings unique to this device that will not affect other users."
		>
			<div id="darkMode" class="setting-anchor">
				<SettingSwitchRow
					label="Dark Mode"
					description="Theme preference for this device/browser."
					:model-value="darkModeEnabled"
					@update:model-value="darkModeEnabled = $event"
				/>
			</div>
		</SettingsContainer>

		<SettingsContainer
			title="Scheduling Settings"
			description="Business-level scheduling rules. Changes are staged until you press Save Settings."
		>
			<template #header-extra>
				<div class="header-meta">
					<div class="save-notice">
						<UIcon name="i-lucide-save" class="save-notice-icon" />
						<span>These settings do not apply until you click <strong>Save Settings</strong>.</span>
					</div>
					<UBadge
						:color="hasUnsavedChanges ? 'warning' : 'success'"
						variant="subtle"
						class="changes-badge"
					>
						{{ hasUnsavedChanges ? "Unsaved Changes" : "Saved" }}
					</UBadge>
				</div>
			</template>

			<UAlert
				v-if="isLoading"
				icon="i-lucide-loader-circle"
				title="Loading Settings"
				description="Fetching current scheduling configuration."
				color="info"
				variant="soft"
				class="loading-alert"
			/>

			<template v-else-if="settings">
				<UAlert
					v-if="statusMessage"
					:icon="statusTone === 'error' ? 'i-lucide-circle-alert' : 'i-lucide-circle-check'"
					:title="statusTone === 'error' ? 'Action Needed' : 'Success'"
					:description="statusMessage"
					:color="statusTone === 'error' ? 'error' : 'success'"
					variant="soft"
					class="status-alert"
				/>

				<UForm
					:schema="settingsFormSchema"
					:state="formState"
					class="space-y-4"
					@submit="saveSettings"
				>
					<div
						v-for="field in switchFields"
						:id="field.key"
						:key="field.key"
						class="setting-anchor"
					>
						<UFormField :name="field.key">
							<SettingSwitchRow
								:label="field.label"
								:description="field.description"
								:model-value="getSwitchValue(field.key)"
								@update:model-value="setSwitchValue(field.key, $event)"
							/>
						</UFormField>
					</div>

					<USeparator />

					<div
						v-for="field in numberFields"
						:id="field.key"
						:key="field.key"
						class="setting-anchor"
					>
						<UFormField :name="field.key">
							<SettingNumberRow
								:label="field.label"
								:description="field.description"
								:model-value="getNumberValue(field.key)"
								:min="field.min"
								@update:model-value="setNumberValue(field.key, $event)"
							/>
						</UFormField>
					</div>

					<div class="actions">
						<UButton
							type="submit"
							:loading="isSaving"
							:disabled="isSaving || !hasUnsavedChanges"
							icon="i-lucide-save"
						>
							Save Settings
						</UButton>
						<UButton
							variant="ghost"
							color="neutral"
							icon="i-lucide-rotate-ccw"
							:disabled="isSaving"
							@click="loadSettings"
						>
							Reset
						</UButton>
					</div>
				</UForm>
			</template>
		</SettingsContainer>
	</div>
</template>

<style scoped>
.settings-page {
    display: grid;
    gap: 1rem;
    padding: 1.5rem;
}

.save-notice {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.75rem;
    border-radius: 0.5rem;
    background: color-mix(in srgb, var(--ui-primary) 10%, transparent);
    font-size: 0.875rem;
}

.header-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
	flex-wrap: wrap;
}

.changes-badge {
	white-space: nowrap;
}

.save-notice-icon {
    color: var(--ui-primary);
}

.loading-alert,
.status-alert {
	margin-bottom: 0.25rem;
}

.actions {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 0.5rem;
}

.setting-anchor {
	scroll-margin-top: 5rem;
}
</style>
