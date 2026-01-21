<script setup lang="ts">
const weekDays = [
    {
        name: "Sunday",
        abbreviation: "SUN",
    },
    {
        name: "Monday",
        abbreviation: "MON",
    },
    {
        name: "Tuesday",
        abbreviation: "TUE",
    },
    {
        name: "Wednesday",
        abbreviation: "WED",
    },
    {
        name: "Thursday",
        abbreviation: "THU",
    },
    {
        name: "Friday",
        abbreviation: "FRI",
    },
    {
        name: "Saturday",
        abbreviation: "SAT",
    },
];
</script>

<style>
.topCalendarContainer {
    --min-cell-width: 50px;
    --max-cell-width: 160px;
    --min-cell-height: 50px;
    --max-cell-height: 70px;

    width: fit-content;
    height: fit-content;
}

.calendarContainer {
    width: fit-content;
    height: fit-content;
}

.timeContainer {
    grid-column: 1;
    grid-row: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
}

.timeLabel {
    width: 100%;
    color: var(--color-gray-500);
}

.calendarBody {
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: row;
}

.calendarDisplay {
    width: fit-content;
    height: fit-content;
    position: relative;
}

.calendarGrid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-areas: "stack-area";
    grid-template-columns: repeat(
        8,
        minmax(var(--min-cell-width), var(--max-cell-width))
    );
    grid-template-rows: repeat(
        25,
        minmax(var(--min-cell-height), var(--max-cell-height))
    );
}

.cellContainer {
    width: 100%;
    height: 100%;
    display: grid;
    grid-area: stack-area;
    grid-column: 2 / -1;
    grid-row: 2 / -1;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
}

.dayDisplay {
    min-width: var(--min-cell-width);
    max-width: var(--max-cell-width);
    height: calc(var(--min-cell-height) + 20px);
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    text-align: center;
    color: var(--color-gray-500);
}

.eventContainer {
    width: 100%;
    height: 100%;
    display: grid;
    grid-area: stack-area;
    grid-column: 1 / -1;
    grid-row: 2 / -1;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
    z-index: 1;
    padding: 0;
}

.event {
    background-color: rgba(from var(--color-red-400) r g b / 0.5);
    grid-row-start: 1;
    grid-row-end: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 20px;
    overflow: hidden;
}

.event > * {
    padding: 0px;
}
</style>

<template>
    <div class="topCalendarContainer">
        <div class="calendarContainer">
            <div class="calendarHeader"></div>
            <div class="calendarBody">
                <div class="calendarDisplay">
                    <div class="calendarGrid">
                        <div class="dayDisplay" v-for="n in 7">
                            <UBadge
                                class="text-primary"
                                color="clear"
                                size="xl"
                                :label="weekDays[n - 1].abbreviation"
                            />
                            <UBadge
                                class="text-dimmed"
                                color="clear"
                                size="xl"
                                :label="n"
                            />
                        </div>
                        <div class="timeContainer">
                            <UBadge color="clear" class="timeLabel"></UBadge>
                            <UBadge
                                color="clear"
                                class="timeLabel"
                                v-for="n in 11"
                                >{{ n }} AM</UBadge
                            >
                            <UBadge color="clear" class="timeLabel"
                                >12 PM</UBadge
                            >
                            <UBadge
                                color="clear"
                                class="timeLabel"
                                v-for="n in 11"
                                >{{ n }} PM</UBadge
                            >
                        </div>
                        <div class="cellContainer">
                            <UCard
                                variant="outline"
                                class="rounded-none ring-gray-300"
                                v-for="n in 7 * 24"
                            />
                        </div>
                        <div class="eventContainer">
                            <UCard
                                class="event ring-2 ring-red-500"
                                variant="subtle"
                                style="
                                    grid-area: 6 / 2 / span 2 / span 1;
                                    margin-top: calc(0.25 * var(--cell-height));
                                    margin-bottom: calc(
                                        0.5 * var(--cell-height)
                                    );
                                "
                            >
                                <UBadge
                                    class="font-bold"
                                    variant="ghost"
                                    label="My Event"
                                />
                                <UBadge
                                    class="font-normal"
                                    variant="ghost"
                                    label="6:15 AM - 7:30 AM"
                                />
                            </UCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
