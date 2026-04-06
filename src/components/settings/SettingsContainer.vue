<script setup lang="ts">
defineProps<{
    title: string;
    description?: string;
}>();
</script>

<template>
    <UCard class="settings-container">
        <template #header>
            <div class="space-y-1">
                <h2 class="text-lg font-semibold">{{ title }}</h2>
                <p v-if="description" class="text-sm text-muted">
                    {{ description }}
                </p>
            </div>
        </template>

        <div class="space-y-4">
            <slot />
        </div>
    </UCard>
</template>

<style scoped>
.text-muted {
    color: color-mix(in srgb, var(--ui-text) 65%, transparent);
}
</style>
