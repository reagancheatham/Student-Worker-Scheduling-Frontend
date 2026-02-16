<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import { shallowRef } from "vue";

const today = new Date();
const defaultValue = shallowRef(
    new CalendarDate(today.getFullYear(), today.getMonth(), today.getDay()),
);
</script>

<template>
    <UCalendar :default-value="defaultValue" />
</template>
