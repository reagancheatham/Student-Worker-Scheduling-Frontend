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
  <UPageCard>
    <template #title> Working Currently </template>
    <UTable :data="data"> </UTable>
  </UPageCard>
</template>
