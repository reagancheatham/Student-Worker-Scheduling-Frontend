<script>

</script>

<template>
    <div class="grid grid-cols-5 gap-4 h-full">
        <!-- Big Side -->
        <div class="col-span-4 grid grid-cols-2 grid-rows-5 gap-4">
            <UPageCard class="col-span-2 row-span-3"></UPageCard>
            <UPageCard class="row-span-2"></UPageCard>
            <UPageCard class="row-span-2"></UPageCard>
        </div>
        
        <!-- Little Side -->
         <div class="col-span-1">
            <UPageCard class="h-full"></UPageCard>
         </div>
    </div>

</template>