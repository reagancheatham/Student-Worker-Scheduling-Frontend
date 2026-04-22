<script setup lang="ts">
import UserSidebar from "@components/UserSidebar.vue";
import { ref } from "vue";

const activeTab = ref<"businesses" | "users">("businesses");
</script>

<template>
    <UDashboardGroup>

            <template #body>
                <div class="h-screen flex flex-col p-4 overflow-hidden">
                    <AdminBusinessesPage v-if="activeTab === 'businesses'" />
                    <AdminUsersPage v-else-if="activeTab === 'users'" />
                    <AdminInvitesPage v-else-if="activeTab === 'Time Sheets'" />
                </div>
            </template>
    </UDashboardGroup>
</template>
