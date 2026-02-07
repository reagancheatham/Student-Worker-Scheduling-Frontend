<script setup>
    import { useRoute } from 'vue-router';
    const route = useRoute();
</script>

<template>
    <UDashboardNavbar :title="route.name" />
</template>