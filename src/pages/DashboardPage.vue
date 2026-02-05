<script>
import WorkingCurrently from "../components/dashboardCards/WorkingCurrently.vue";
</script>

<template>
  <div class="grid grid-cols-5 gap-4 h-screen">
    <!-- Big Side -->
    <div class="col-span-4 grid grid-cols-2 grid-rows-5 gap-4 h-screen">
      <UPageCard title="Schedule" class="col-span-2 row-span-3"></UPageCard>
      <WorkingCurrently class="row-span-2"></WorkingCurrently>
      <UPageCard title="Open Shifts" class="row-span-2"></UPageCard>
    </div>

    <!-- Little Side -->
    <div class="col-span-1">
      <UPageCard class="h-screen"></UPageCard>
    </div>
  </div>
</template>
