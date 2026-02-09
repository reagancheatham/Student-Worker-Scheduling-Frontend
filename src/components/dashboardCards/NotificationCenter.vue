<script setup lang="ts">
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
          />
        </template>
      </UPageCard>
    </UPageList>
  </UCard>
</template>
