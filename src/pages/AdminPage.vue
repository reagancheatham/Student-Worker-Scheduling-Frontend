<script setup lang="ts">
import AdminSidebar from "@components/AdminSidebar.vue";
import AdminBusinessesPage from "./AdminBusinessesPage.vue";
import AdminUsersPage from "./AdminUsersPage.vue";
import AdminInvitesPage from "./AdminInvitesPage.vue";
import { ref } from "vue";

const activeTab = ref<"businesses" | "users">("businesses");
</script>

<template>
    <UDashboardGroup>
        <AdminSidebar v-model:active-tab="activeTab" />

        <UDashboardPanel>
            <template #header>
                <UDashboardNavbar
                    :title="`Admin - ${activeTab === 'businesses' ? 'Businesses' : 'Users'}`"
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

            <template #body>
                <div class="h-screen flex flex-col p-4 overflow-hidden">
                    <AdminBusinessesPage v-if="activeTab === 'businesses'" />
                    <AdminUsersPage v-else-if="activeTab === 'users'" />
                    <AdminInvitesPage v-else-if="activeTab === 'invites'" />
                </div>
            </template>
        </UDashboardPanel>
    </UDashboardGroup>
</template>
