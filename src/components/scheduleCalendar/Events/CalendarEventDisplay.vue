<style>
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
</style>

<template>
    <div class="eventContainer">
        <CalendarEvent
            color="--color-sky-500"
            :day="1"
            :start-hour="6"
            :start-minute="15"
            start-period="AM"
            :end-hour="7"
            :end-minute="30"
            end-period="AM"
        />
        <CalendarEvent
            color="--color-orange-500"
            :day="2"
            :start-hour="8"
            :start-minute="15"
            start-period="AM"
            :end-hour="12"
            :end-minute="30"
            end-period="AM"
        />
    </div>
</template>
