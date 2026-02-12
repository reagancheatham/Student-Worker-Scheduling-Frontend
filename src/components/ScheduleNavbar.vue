<script setup>
    import { useRoute } from 'vue-router';
    const route = useRoute();
</script>

<template>
    <UDashboardNavbar 
        :title="route.name"
        :ui = "{
            root: 'px-0!'
        }"
    >
        <template #right>
            <img class="h-13 w-85" src="/OC.png" alt="OC Logo">
        </template>
    </UDashboardNavbar>
</template>

<style scoped>

</style>