<script setup>
import { Store } from "@classes/util/store.ts";
import { useRoute } from "vue-router";
const route = useRoute();
const business = Store.getBusiness();
</script>

<template>
    <UDashboardNavbar
        :title="`${business.name} - ${route.name}`"
        :ui="{
            root: 'px-0!',
            title: 'px-5!',
        }"
    >
        <template #right>
            <img class="h-13 w-85" src="/OC.png" alt="OC Logo" />
        </template>
    </UDashboardNavbar>
</template>

<style scoped></style>
