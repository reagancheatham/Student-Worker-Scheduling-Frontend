<script setup lang="ts">
import { Business } from "@classes/database/business.ts";
import { Store } from "@classes/util/store.ts";
import { TempStore } from "@classes/util/tempStore.ts";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const business = ref<Business>();
const isLoading = TempStore.refIsLoading;

onMounted(async () => (business.value = await Store.getBusiness()));
</script>

<template>
    <UDashboardNavbar
        :title="
            business
                ? `${business.name} - ${route.name?.toString()}`
                : `${route.name?.toString()}`
        "
        :ui="{
            root: 'px-0!',
            title: 'px-5!',
        }"
    >
        <template #right>
            <img class="h-13 w-85" src="/OC.png" alt="OC Logo" />
        </template>
    </UDashboardNavbar>
    <UProgress v-if="isLoading" size="sm" />
</template>

<style scoped></style>
