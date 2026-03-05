<template>
    <UDashboardGroup>
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
</template>
