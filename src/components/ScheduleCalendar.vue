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
    --cell-width: 90px;
    --cell-height: 70px;

    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: row;
}

.calendarContainer {
    width: fit-content;
    height: fit-content;
}

.timeContainer {
    height: 100%;
    width: var(--cell-width);
    margin-top: -25px;
}

.timeLabel {
    width: 100%;
    justify-content: flex-end;
    margin-top: 23px;
    margin-bottom: 23px;
    padding-right: 12px;
    color: var(--color-gray-500);
}

.calendarHeader {
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: row;
    margin-left: var(--cell-width);
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
    display: grid;
    grid-template-columns: repeat(7, var(--cell-width));
    grid-auto-rows: var(--cell-height);
}

.calendarCell {
    grid-area: var(--row-start) / var(--row-end) / var(--column-start) / var(--column-end);
}

.dayDisplay {
    width: 90px;
    height: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
    text-align: center;
    color: var(--color-gray-500);
}

.event {
    background-color: var(--color-red-200);
    grid-row-start: 1;
    grid-row-end: 2;
    grid-column-start: 1;
    grid-column-end: 2;
}
</style>

<template>
    <div class="topCalendarContainer">
        <div class="calendarContainer">
            <div class="calendarHeader">
                <div class="dayDisplay" v-for="n in 7">
                    <UBadge
                        square
                        color="clear"
                        size="xl"
                        :label="weekDays[n - 1].abbreviation"
                    />
                    <UBadge square color="clear" size="xl" :label="n" />
                </div>
            </div>
            <div class="calendarBody">
                <div class="timeContainer">
                    <UBadge color="clear" class="timeLabel"></UBadge>
                    <UBadge color="clear" class="timeLabel" v-for="n in 11"
                        >{{ n }} AM</UBadge
                    >
                    <UBadge color="clear" class="timeLabel">12 PM</UBadge>
                    <UBadge color="clear" class="timeLabel" v-for="n in 11"
                        >{{ n }} PM</UBadge
                    >
                </div>
                <div class="calendarDisplay">
                    <UCard
                        variant="outline"
                        class="calendarCell rounded-none ring-gray-300"
                        v-for="n in 7 * 24"
                        style="
                        --row-start: {{ n }};
                        --row-end: {{ n + 1 }};
                        --column-start: {{ n % 7 }};
                        --column-end: {{ n % 7 + 1 }};
                        "
                    />
                    <UCard class="event ring-2 ring-red-400" variant="subtle" />
                </div>
            </div>
        </div>
    </div>
</template>
