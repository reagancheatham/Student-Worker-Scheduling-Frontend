<script setup lang="ts">
const props = defineProps<{
    label: string;
    description?: string;
    modelValue: number;
    min?: number;
    max?: number;
    step?: number;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: number];
}>();

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const parsed = Number.parseInt(target.value, 10);

    if (!Number.isNaN(parsed)) {
        emit("update:modelValue", parsed);
    }
};
</script>

<template>
    <div class="setting-row">
        <div>
            <h3 class="setting-label">{{ label }}</h3>
            <p v-if="description" class="setting-description">{{ description }}</p>
        </div>

        <UInput
            type="number"
            :model-value="props.modelValue"
            :min="props.min"
            :max="props.max"
            :step="props.step ?? 1"
            @input="onInput"
        />
    </div>
</template>

<style scoped>
.setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.setting-label {
    font-weight: 600;
}

.setting-description {
    font-size: 0.875rem;
    color: color-mix(in srgb, var(--ui-text) 65%, transparent);
}
</style>
