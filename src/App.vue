<template>
    <UApp>
        <UMain>
            <UDashboardGroup>
                <ScheduleSidebar />
                <UDashboardPanel>
                    <template #header>
                        <UDashboardNavbar />
                    </template>

                    <template #body>
                        <ScheduleCalendar />
                    </template>
                </UDashboardPanel>
            </UDashboardGroup>
        </UMain>
        <UFooter />
    </UApp>
</template>
