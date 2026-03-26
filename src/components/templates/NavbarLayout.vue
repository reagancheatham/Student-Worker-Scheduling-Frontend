<script setup lang="ts">
    import type { NavigationMenuItem } from '@nuxt/ui'

    const isMobile = window.innerWidth <= 768;

    const items: NavigationMenuItem[] = [
        {
            label: 'Home',
            icon: 'i-lucide-house'
        },
        {
            label: 'Schedule',
            icon: 'i-lucide-calendar-fold'
        },
        {
            label: 'Shift Board',
            icon: 'i-lucide-clipboard-list'
        },
    ]
</script>

<template>
    <UDashboardGroup v-if="!isMobile">
        <ScheduleSidebar />
        <UDashboardPanel>
            <template #header>
                <ScheduleNavbar />
            </template>

            <template #body class="overflow-hidden!">
                <!-- <ScheduleCalendar /> -->
                <RouterView />
            </template>
        </UDashboardPanel>
    </UDashboardGroup>

    <UNavigationMenu
    v-if="isMobile"
    :items="items"
    :ui="{
      root: 'justify-around border-t border-default py-2',
      item: 'py-0',
      link: 'flex-col gap-1 px-6',
      linkLeadingIcon: 'size-5',
      linkLabel: 'text-[10px]/3 font-normal'
    }"
    class="w-full"
  />
</template>
