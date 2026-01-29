<template>
    <UApp>
        <UMain>
            <UDashboardGroup>
                <ScheduleSidebar />
                <UDashboardPanel>
                    <template #header>
                        <ScheduleNavbar/>
                    </template>

                    <template #body>
                        <!-- <ScheduleCalendar /> -->
                        <RouterView/>
                    </template>
                </UDashboardPanel>
            </UDashboardGroup>
        </UMain>
        <UFooter />
    </UApp>
</template>
