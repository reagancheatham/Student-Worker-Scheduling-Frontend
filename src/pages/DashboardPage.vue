<script>

</script>

<template>
    <!-- Divides the page into 4ths -->
    <div class="grid grid-cols-4 gap-4">
        <UPageGrid class="col-span-3">
            <UPageCard class="col-span-full"></UPageCard>
            <UPageCard></UPageCard>
            <UPageCard></UPageCard>

        </UPageGrid>
        
        <!-- Notifs center -->
        <UPageColumns>
            <UPageCard></UPageCard>
        </UPageColumns>
    </div>
</template>