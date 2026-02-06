<style>
.calendarContainer {
    --min-cell-width: 50px;
    --max-cell-width: 240px;
    --min-cell-height: calc(10px / 60);
    --max-cell-height: calc(40px / 60);

    width: fit-content;
    height: fit-content;
    margin-top: 5vh;
    margin-left: -5%;
}

.calendarBody {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
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
</style>

<template>
    <div class="calendarContainer">
        <div class="calendarBody">
            <div class="calendarGrid">
                <CalendarWeekDayDisplay />
                <CalendarTimeDisplay />
                <CalendarCellDisplay />
                <CalendarEventDisplay />
            </div>
        </div>
    </div>
</template>
