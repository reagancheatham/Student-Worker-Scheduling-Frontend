<script setup lang="ts">
const props = defineProps<{
    label: string;
    description?: string;
    modelValue: boolean;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
}>();

const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit("update:modelValue", target.checked);
};
</script>

<template>
    <div class="setting-row">
        <div>
            <h3 class="setting-label">{{ label }}</h3>
            <p v-if="description" class="setting-description">{{ description }}</p>
        </div>

        <label class="switch" :aria-label="label">
            <input
                type="checkbox"
                :checked="props.modelValue"
                @change="onChange"
            />
            <span class="slider" />
        </label>
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

.switch {
    position: relative;
    width: 48px;
    height: 28px;
    display: inline-block;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background-color: color-mix(in srgb, var(--ui-text) 20%, transparent);
    transition: background-color 0.2s ease;
}

.slider::before {
    content: "";
    position: absolute;
    width: 22px;
    height: 22px;
    left: 3px;
    top: 3px;
    border-radius: 50%;
    background: white;
    transition: transform 0.2s ease;
}

.switch input:checked + .slider {
    background-color: var(--ui-primary);
}

.switch input:checked + .slider::before {
    transform: translateX(20px);
}
</style>
