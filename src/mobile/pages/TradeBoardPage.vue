<script setup lang="ts">
const tabs = [
    {
        label: "Trade Board",
        slot: "trade",
    },
    {
        label: "Pending",
        slot: "pending",
    },
];
</script>

<template>
    <UTabs :items="tabs">
        <template #trade>
            <div class="text-center pt-5 font-bold text-xl">Trade Board</div>

            <div class="overflow-y-auto px-1">
                <div class="p-3 space-y-3">
                    <UPageCard orientation="horizontal">
                        <div>Test</div>
                    </UPageCard>
                </div>
            </div>
        </template>
        <template #pending>
            <div class="text-center pt-5 font-bold text-xl">
                Pending Trades
            </div>
        </template>
    </UTabs>
</template>
