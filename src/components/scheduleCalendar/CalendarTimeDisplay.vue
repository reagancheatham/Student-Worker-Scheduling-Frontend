<style>
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
</style>

<template>
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
</template>
