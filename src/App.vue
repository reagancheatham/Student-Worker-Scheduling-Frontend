<template>
    <UApp>
        <UMain>
            <UDashboardGroup>
                <ScheduleSidebar />
                <UDashboardPanel>
                    <template #header>
                        <ScheduleNavbar/>
                    </template>

                    <template #body class="overflow-hidden!">
                        <!-- <ScheduleCalendar /> -->
                        <RouterView />
                    </template>
                </UDashboardPanel>
            </UDashboardGroup>
        </UMain>
        <UFooter />
    </UApp>
</template>
