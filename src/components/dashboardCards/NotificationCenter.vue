<script setup lang="ts">
import { ref } from "vue";
import { TimeOffRequestServices } from "../../services/timeOffServices";
import { useRoute } from "vue-router";

const notifications = ref<Notification[]>([]);

//this function will more likely than not just service call each type of notification backend model, unify them, then put em in an array of notification classes
function getNotifications() {
  const route = useRoute();
  const businessID = route.params.businessID as string;
  const timeOffRequests = TimeOffRequestServices.getAllForBusiness(Number(businessID));

  notifications.value = timeOffRequests.map((req) => {
    return new Notification(
      req.employeeName, 
      
    );
  });
}
const users = [
  {
    name: "Davey Clonts",
    description: "Time Off Request",
    avatar: {},
  },
  {
    name: "Max Jones",
    description: "Dropped Shift",
    avatar: {},
  },
];
</script>

<template>
  <UCard
    :ui="{
      header: 'font-semibold text-black shrink-0',
      body: '!px-0 !pt-0 !pb-3 flex-1 overflow-y-auto min-h-0',
    }"
  >
    <template #header>
      <span>Notifications</span>
    </template>
    <UPageList>
      <UPageCard variant="ghost" v-for="(user, index) in users" :key="index">
        <template #body>
          <UUser
            :name="user.name"
            :description="user.description"
            :avatar="user.avatar"
            :ui="{
              root: 'hover:bg-gray-50 rounded-md cursor-pointer transition-colors duration-150',
            }"
            @click="console.log()"
          />
        </template>
      </UPageCard>
    </UPageList>
  </UCard>
</template>
