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
    --min-cell-height: calc(10px / 60);
    --max-cell-height: calc(40px / 60);

    width: fit-content;
    height: fit-content;
    margin-top: 5vh;
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
    grid-row: span 60;
    position: relative;
    justify-content: right;
    padding-right: 12px;
    top: 50%;
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
        calc((1 + 24) * 60),
        minmax(var(--min-cell-height), var(--max-cell-height))
    );
}

.cellContainer {
    width: 100%;
    height: 100%;
    display: grid;
    grid-area: stack-area;
    grid-column: 2 / -1;
    grid-row: 61 / -1;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
}

.calendarCell {
    grid-column: span 1;
    grid-row: span 60;
}

.dayContainer {
    display: grid;
    grid-column: 2 / -1;
    grid-row: 1 / 60;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
}

.dayDisplay {
    display: flex;
    flex-direction: column;
    grid-column: span 1;
    grid-row: span 60;
    justify-content: flex-end;
    align-items: center;
    color: var(--color-gray-500);
    position: relative;
    margin-top: -2vh;
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
    background-color: rgba(from var(--color-sky-500) r g b / 1);
    border-left-width: 4px;
    border-color: var(--color-sky-600);
    display: flex;
    flex-direction: column;
    padding-left: 10px;
}

.event * {
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
                        <div class="dayContainer">
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
                                class="calendarCell rounded-none ring-gray-300"
                                variant="outline"
                                v-for="_ in 7 * 24"
                            />
                        </div>
                        <div class="eventContainer">
                            <UCard
                                class="event"
                                variant="ghost"
                                style="
                                    grid-area: calc(60 * 7 + 15) / 2 / span
                                        125 / span 1;
                                "
                            >
                                <template #header>
                                    <UBadge
                                        class="font-medium text-black"
                                        variant="ghost"
                                        label="My Event"
                                        style="max-width: 100%"
                                    />
                                </template>

                                <template #default>
                                    <UBadge
                                        class="font-normal text-gray-800 w-full"
                                        variant="ghost"
                                        label="6:15 AM - 7:30 AM"
                                        style="
                                            background-color: green;
                                            height: 80px;
                                            display: flex;
                                            flex-direction: column;
                                        "
                                    >
                                        <template #label="{ label }">
                                            <span
                                                class="whitespace-normal text-wrap"
                                            >
                                                {{ label }}
                                            </span>
                                        </template>
                                    </UBadge>
                                </template>
                            </UCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
