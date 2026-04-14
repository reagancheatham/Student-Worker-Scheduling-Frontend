<script setup lang="ts">
import { ScheduleTemplate } from "@classes/database/scheduleTemplate.ts";
import { ref } from "vue";

const scheduleTemplate = ref<ScheduleTemplate>();
</script>

<style>
.templateCreator {
    height: 100vh;
}

.scheduleContainer {
    height: 82vh;
    padding-bottom: 20px;
}

body {
    overflow: hidden;
}
</style>

<template>
    <div v-if="scheduleTemplate" class="scheduleContainer">
        <ScheduleCalendar header editable template />
    </div>
    <UCard v-else class="templateCreator" :ui="{ body: 'h-full justify-items-center content-center text-center' }">
        <template #default>
            <p class="text-xl">Create or Edit Template</p>
            <div class="flex">
                <UDropdownMenu>
                    <UButton variant="outline" color="neutral" />
                </UDropdownMenu>
            </div>
        </template>
    </UCard>
</template>
