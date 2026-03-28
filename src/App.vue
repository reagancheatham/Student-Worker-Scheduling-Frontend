<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
</script>

<template>
    <UApp>
        <UMain>
            <RouterView />
        </UMain>
        <UFooter />
    </UApp>
    <UNotifications />
</template>
