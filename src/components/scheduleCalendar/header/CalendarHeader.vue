<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { EventColor } from "@classes/calendar/eventColor.ts";
import { EventData } from "@classes/calendar/eventData.ts";
import { ShiftEventData } from "@classes/calendar/shiftEventData";
import { ShiftTemplateEventData } from "@classes/calendar/shiftTemplateEventData.ts";
import { Business } from "@classes/database/business.ts";
import { ScheduleShiftTemplate } from "@classes/database/scheduleShiftTemplate.ts";
import { Shift } from "@classes/database/shift.ts";
import { ShiftTaskListTemplate } from "@classes/database/shiftTaskListTemplate.ts";
import { Store } from "@classes/util/store.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { WeekDay } from "@classes/util/weekDay.ts";
import { today } from "@internationalized/date";
import { onMounted, ref } from "vue";
import { ScheduleTemplateServices } from "../../../services/scheduleTemplateServices.ts";

const { data, cellSize } = defineProps<{
    data: CalendarData;
    cellSize: Vector2;
    template?: boolean;
}>();

const editedEvent = ref<EventData>(
    new ShiftEventData(
        new Shift(0, 0, "", new Date(), new Date(), EventColor.blue, false),
    ),
);
const isModalOpen = ref(false);
const templateName = ref("");
const isUpdatingTemplateName = ref(false);
const business = ref<Business>();

const createItems = [
    [
        {
            label: "Shift",
            icon: "i-heroicons-calendar-days-20-solid",
            onSelect() {
                createShift();
            },
        },
    ],
];

const createTemplateItems = [
    [
        {
            label: "Shift",
            icon: "i-heroicons-calendar-days-20-solid",
            onSelect() {
                createTemplateShift();
            },
        },
    ],
];

onMounted(async () => {
    business.value = await Store.getBusiness();
    editedEvent.value = new ShiftEventData(createDefaultShift());

    if (data.isTemplate) templateName.value = data.selectedTemplate!.name;
});

function getStyle() {
    if (data.selectedView === CalendarMode.Day)
        return {
            marginLeft: `${cellSize.x}px`,
        };
    else
        return {
            marginLeft: `${0.25 * cellSize.x}px`,
            marginBottom: `24px`,
        };
}

function getButtonStyle() {
    if (data.selectedView === CalendarMode.Day) return {};
    else
        return {
            marginLeft: `${0.35 * cellSize.x}px`,
            marginRight: `${0.1 * cellSize.x}px`,
        };
}

function goToToday() {
    data.selectedDay = today(CalendarData.timeZone);
}

function createShift() {
    editedEvent.value = new ShiftEventData(createDefaultShift());

    isModalOpen.value = true;
}

function createTemplateShift() {
    editedEvent.value = new ShiftTemplateEventData(
        createDefaultShiftTemplate(),
    );

    isModalOpen.value = true;
}

function createDefaultShift(): Shift {
    const startTime = new Date();
    const endTime = new Date();

    startTime.setHours(9, 0);
    endTime.setHours(12, 0);

    return new Shift(
        0,
        business.value ? business.value.id : 0,
        "New Shift",
        startTime,
        endTime,
        EventColor.blue,
        false,
    );
}

function createDefaultShiftTemplate(): ScheduleShiftTemplate {
    const selectedTemplate = data.selectedTemplate;
    const startTime = new Date();
    const endTime = new Date();

    startTime.setHours(9, 0);
    endTime.setHours(12, 0);

    return new ScheduleShiftTemplate(
        0,
        selectedTemplate ? selectedTemplate.id : 0,
        "New Shift",
        startTime,
        endTime,
        EventColor.blue,
        WeekDay.Sunday,
        new ShiftTaskListTemplate(0, 0, "Task List", []),
    );
}

function closeModal() {
    isModalOpen.value = false;
}

function updateRelevantEvents() {
    data.updateRelevantData();
}

async function updateTemplateName(_: Event): Promise<void> {
    if (!data.selectedTemplate) return;

    const newValue = templateName.value;

    if (newValue === "") templateName.value = data.selectedTemplate.name;
    else {
        isUpdatingTemplateName.value = true;
        data.selectedTemplate.name = newValue;

        await ScheduleTemplateServices.update(data.selectedTemplate);

        isUpdatingTemplateName.value = false;
    }
}
</script>

<style>
.headerContainer {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    height: 10%;
}

.headerSegment {
    display: flex;
    align-items: flex-end;
    gap: 12px;
}

.leftSegment {
    margin-left: 0px;
    margin-right: auto;
}

.rightSegment {
    margin-right: 0px;
    margin-left: auto;
}

.formField {
    width: fit-content;
}
</style>

<template>
    <div class="headerContainer" :style="getStyle()">
        <UDropdownMenu
            :items="data.isTemplate ? createTemplateItems : createItems"
        >
            <UButton
                icon="i-heroicons-plus-20-solid"
                class="px-5 py-5 shadow-md -mb-3"
                :style="getButtonStyle()"
            />
        </UDropdownMenu>
        <div class="headerSegment leftSegment">
            <UInput
                v-if="data.selectedTemplate"
                v-model="templateName"
                :class="data.selectedView === CalendarMode.Day ? 'ml-6' : ''"
                :disabled="isUpdatingTemplateName"
                size="xl"
                variant="outline"
                placeholder="Template Name"
                @change="updateTemplateName"
            />
            <CalendarDateShifter
                v-if="
                    !data.isTemplate || data.selectedView === CalendarMode.Day
                "
                :data="data"
            />
        </div>
        <div class="headerSegment rightSegment">
            <UButton
                v-if="!data.isTemplate"
                label="Today"
                variant="outline"
                color="neutral"
                @click="goToToday"
            ></UButton>
            <UFormField
                v-if="!data.isTemplate"
                class="selectMenuContainer"
                label="Date"
                name="option"
            >
                <CalendarDatePicker v-if="!data.isTemplate" :data="data" />
            </UFormField>
            <UFormField class="selectMenuContainer" label="View" name="option">
                <CalendarModeSelect v-model="data.selectedView" />
            </UFormField>
        </div>
    </div>
    <CalendarEventEditor
        v-model="editedEvent"
        :is-open="isModalOpen"
        :data="data"
        @close-requested="closeModal"
        @form-submitted="updateRelevantEvents"
        creator
    />
</template>
