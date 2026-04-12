<script setup lang="ts">
import { computed, ref } from "vue";
import { useColorMode } from "@vueuse/core";
import { Settings } from "@classes/database/settings.ts";
import { SettingsServices } from "../services/settingsServices.ts";
import { Store } from "@classes/util/store.ts";

type SwitchSettingKey =
    | "doubleTaskSignOff"
    | "employeeSignOff"
    | "allowClockInOut"
    | "automaticShiftTrades"
    | "enableOpenShift"
    | "enableShiftTrades";

type NumberSettingKey = "clockInThreshold" | "onTimeThreshold";
type TextSettingKey = "defaultTermCode";

const settings = ref<Settings | null>(null);
const isLoading = ref(true);
const isSaving = ref(false);
const statusMessage = ref("");
const colorMode = useColorMode();

const darkModeEnabled = computed({
    get: () => colorMode.value === "dark",
    set: (isDark: boolean) => {
        colorMode.value = isDark ? "dark" : "light";
    },
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

function getSwitchValue(key: SwitchSettingKey): boolean {
    if (!settings.value) {
        return false;
    }

    return settings.value[key];
}

function setSwitchValue(key: SwitchSettingKey, value: boolean) {
    if (!settings.value) {
        return;
    }

    settings.value[key] = value;
}

function getNumberValue(key: NumberSettingKey): number {
    if (!settings.value) {
        return 0;
    }

    return settings.value[key];
}

function setNumberValue(key: NumberSettingKey, value: number) {
    if (!settings.value) {
        return;
    }

    settings.value[key] = value;
}

function getTextValue(key: TextSettingKey): string {
    if (!settings.value) {
        return "";
    }

    return settings.value[key];
}

function setTextValue(key: TextSettingKey, value: string) {
    if (!settings.value) {
        return;
    }

    settings.value[key] = value;
}

async function loadSettings() {
    isLoading.value = true;
    statusMessage.value = "";

    const business = await Store.getBusiness();

    if (!business) return;

    try {
        settings.value = await SettingsServices.getOrCreateDefault(business.id);
    } catch (err) {
        console.error("Failed to load settings", err);
        statusMessage.value = "Unable to load settings.";
    } finally {
        isLoading.value = false;
    }
}

async function saveSettings() {
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
}

loadSettings();
</script>

<template>
    <div class="settings-page">
        <SettingsContainer
            title="Browser Settings"
            description="Settings unique to this device that will not affect other users."
        >
            <SettingSwitchRow
                label="Dark Mode"
                description="Theme preference for this device/browser."
                :model-value="darkModeEnabled"
                @update:model-value="darkModeEnabled = $event"
            />
        </SettingsContainer>

        <SettingsContainer
            title="Scheduling Settings"
            description="Business-level scheduling rules. Changes are staged until you press Save Settings."
        >
            <template #header-extra>
                <div class="save-notice">
                    <UIcon name="i-lucide-save" class="save-notice-icon" />
                    <span
                        >These settings do not apply until you click
                        <strong>Save Settings</strong>.</span
                    >
                </div>
            </template>

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

                <USeparator />

                <div class="setting-row">
                    <div>
                        <h3 class="setting-label">Default Term Code</h3>
                        <p class="setting-description">
                            Used for automatic unavailability refreshes when a student ID is set and no term code is provided in the request.
                        </p>
                    </div>

                    <UInput
                        :model-value="getTextValue('defaultTermCode')"
                        placeholder="e.g. 2026SP"
                        @update:model-value="setTextValue('defaultTermCode', String($event ?? ''))"
                    />
                </div>

                <div class="actions">
                    <UButton
                        :loading="isSaving"
                        :disabled="isSaving"
                        @click="saveSettings"
                    >
                        Save Settings
                    </UButton>
                    <span v-if="statusMessage" class="text-sm">{{
                        statusMessage
                    }}</span>
                </div>
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

.save-notice-icon {
    color: var(--ui-primary);
}

.actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.5rem;
}

.setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.setting-label {
    font-weight: 600;
}

.setting-description {
    font-size: 0.875rem;
    color: color-mix(in srgb, var(--ui-text) 65%, transparent);
}
</style>
