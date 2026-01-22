<style>
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
</style>

<template>
    <div class="cellContainer">
        <UCard
            class="calendarCell rounded-none ring-gray-400"
            variant="outline"
            v-for="_ in 7 * 24"
        />
    </div>
</template>
