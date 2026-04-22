<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ScheduleTemplate } from "@classes/database/scheduleTemplate.ts";
import { ScheduleTemplateServices } from "../../../services/scheduleTemplateServices.ts";
import { Store } from "@classes/util/store/store.ts";
import { ScheduleShiftTemplateServices } from "../../../services/scheduleShiftTemplateServices.ts";
import { ShiftServices } from "../../../services/shiftServices.ts";
import { TempStore } from "@classes/util/store/tempStore.ts";
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { WeekDay } from "@classes/util/weekDay.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { Shift } from "@classes/database/shift.ts";

const scheduleTemplates = ref<ScheduleTemplate[]>([]);
const weekDays = ref<WeekDay[]>(Object.values(WeekDay));
const selectedTemplate = ref<ScheduleTemplate>();
const selectedDay = ref<WeekDay>(WeekDay.Monday);

const { data } = defineProps<{
    data: CalendarData;
}>();

onMounted(async () => {
    const business = await Store.businessStore.get();

    if (!business) return;

    scheduleTemplates.value = await ScheduleTemplateServices.getAllForBusiness(
        business.id,
    );
});

async function pasteTemplate(): Promise<void> {
    if (!selectedTemplate.value) {
        console.error(`Cannot paste undefined template!`);
        return;
    }

    TempStore.isLoading = true;

    const shiftTemplates =
        await ScheduleShiftTemplateServices.getAllForScheduleTemplate(
            selectedTemplate.value.id,
        );

    let shifts: Shift[];

    if (data.selectedView === CalendarMode.Day) {
        shifts = shiftTemplates
            .filter((st) => st.weekDay === selectedDay.value)
            .map((st) =>
                st.toShift(
                    selectedTemplate.value!.businessID,
                    data.selectedDay,
                ),
            );
    } else {
        shifts = shiftTemplates.map((st) =>
            st.toShiftRelative(
                selectedTemplate.value!.businessID,
                data.selectedWeek.start,
            ),
        );
    }

    const promises = shifts.map(
        async (shift) => await ShiftServices.create(shift),
    );

    await Promise.all(promises);
    await data.updateRelevantData();

    TempStore.isLoading = false;
}

function resetState(): void {
    selectedTemplate.value = undefined;
    selectedDay.value = WeekDay.Monday;
}
</script>

<template>
    <UModal title="Paste Template" :ui="{ content: 'sm:max-w-xs' }">
        <UButton
            icon="i-lucide-clipboard-paste"
            label="Paste Template"
            color="neutral"
            variant="outline"
            @click="resetState()"
        />
        <template #body>
            <UFormField label="Template to Paste">
                <USelectMenu
                    v-model="selectedTemplate"
                    :items="scheduleTemplates"
                    label-key="name"
                    placeholder="Select Template"
                    class="min-w-48"
                />
            </UFormField>
            <UFormField
                v-if="data.selectedView === CalendarMode.Day"
                class="mt-4"
                label="Day to Paste"
            >
                <USelectMenu
                    v-model="selectedDay"
                    class="min-w-36"
                    :items="weekDays"
                    :search-input="false"
                />
            </UFormField>
        </template>
        <template #footer="{ close }">
            <UButton
                class="ml-auto"
                label="Paste"
                :disabled="!selectedTemplate"
                @click="
                    () => {
                        close();
                        pasteTemplate();
                    }
                "
            />
            <UButton
                label="Cancel"
                color="neutral"
                variant="outline"
                @click="close()"
            />
        </template>
    </UModal>
</template>
