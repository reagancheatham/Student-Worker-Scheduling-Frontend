<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { EventColor } from "@classes/calendar/eventColor.ts";
import { EventData } from "@classes/calendar/eventData.ts";
import { ShiftEventData } from "@classes/calendar/shiftEventData";
import { Business } from "@classes/database/business.ts";
import { Shift } from "@classes/database/shift.ts";
import { Store } from "@classes/util/store.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { today } from "@internationalized/date";
import { onMounted, ref } from "vue";

const {
    data,
    cellSize,
    template = false,
} = defineProps<{
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
const business = ref<Business>();

const createItems = [
    [
        {
            label: "Shift",
            icon: "i-heroicons-calendar-days-20-solid",
            onSelect() {
                createEvent();
            },
        },
    ],
];

onMounted(async () => {
    business.value = await Store.getBusiness();
    editedEvent.value = new ShiftEventData(createDefaultShift());
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

function createEvent() {
    editedEvent.value = new ShiftEventData(createDefaultShift());

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

function closeModal() {
    isModalOpen.value = false;
}

function updateRelevantEvents() {
    data.updateRelevantData();
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
        <UDropdownMenu :items="createItems">
            <UButton
                icon="i-heroicons-plus-20-solid"
                class="px-5 py-5 shadow-md -mb-4"
                :style="getButtonStyle()"
            />
        </UDropdownMenu>
        <div class="headerSegment leftSegment">
            <CalendarDateShifter v-if="!template" :data="data" />
            <p
                v-if="template"
                class="mb-0.5 ml-4 text-lg font-medium text-neutral-500"
            >
                Template Builder
            </p>
        </div>
        <div class="headerSegment rightSegment">
            <UButton
                v-if="template"
                label="Today"
                variant="outline"
                color="neutral"
                @click="goToToday"
            ></UButton>
            <UFormField
                v-if="template"
                class="selectMenuContainer"
                label="Date"
                name="option"
            >
                <CalendarDatePicker :data="data" />
            </UFormField>
            <UFormField class="selectMenuContainer" label="View" name="option">
                <CalendarModeSelect v-model="data.selectedView" />
            </UFormField>
        </div>
    </div>
    <CalendarEventEditor
        v-model="editedEvent"
        :is-open="isModalOpen"
        @close-requested="closeModal"
        @form-submitted="updateRelevantEvents"
        creator
    />
</template>
