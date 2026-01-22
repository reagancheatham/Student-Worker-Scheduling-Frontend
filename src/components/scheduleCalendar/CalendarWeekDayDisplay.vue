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
</style>

<template>
    <div class="dayContainer">
        <div class="dayDisplay" v-for="n in 7">
            <UBadge
                class="text-primary"
                color="clear"
                size="xl"
                :label="weekDays[n - 1].abbreviation"
            />
            <UBadge class="text-dimmed" color="clear" size="xl" :label="n" />
        </div>
    </div>
</template>
