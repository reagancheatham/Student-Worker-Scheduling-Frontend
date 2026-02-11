<script setup>
    import { useRoute } from 'vue-router';
    const route = useRoute();
</script>

<template>
    <UDashboardNavbar 
        :title="route.name"
    >
        <template #right>
            <img class="h-60 w-auto m-0" src="/OC.png" alt="OC Logo">
        </template>
    </UDashboardNavbar>
</template>

<style scoped>

</style>