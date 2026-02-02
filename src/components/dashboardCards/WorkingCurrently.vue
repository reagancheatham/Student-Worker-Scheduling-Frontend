<script setup lang="ts">
import { ref } from "vue";

type ShiftInfo = {
  Name: String;
  Shift: String; //string for now
  Status: "Late" | "On Time" | "Upcoming";
};

const data = ref<ShiftInfo[]>([
  {
    Name: "David Clonts",
    Shift: "10:30a.m. - 2:30p.m.",
    Status: "Late",
  },
]);
</script>

<template>
  <UCard :ui="{header: 'font-semibold text-black col-span-1', body: '!px-0 !pt-0 !pb-3'}">
    <template #header> 
      <span class="mb">
        Working Currently
      </span>
  </template>
    <UTable :data="data"> </UTable>
  </UCard>
</template>
