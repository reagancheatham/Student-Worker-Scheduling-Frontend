<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';

const emit = defineEmits({
    cellSizeChanged: (_: number) => true,
});

const cellElements = useTemplateRef<any[]>("cells");

onMounted(() => {
    const unwrappedElement = cellElements.value?.[0]?.$el;

    const observer = new ResizeObserver(() => {
        const size = unwrappedElement.getBoundingClientRect().width;

        emit("cellSizeChanged", size);
    })

    observer.observe(unwrappedElement);

    onUnmounted(() => observer.disconnect());
});
</script>

<style>
.cellContainer {
    width: 100%;
    height: 100%;
    display: grid;
    grid-area: stack-area;
    grid-column: 2 / -1;
    grid-row: 61 / -1;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
}

.calendarCell {
    grid-column: span 1;
    grid-row: span 60;
    /* background-color: var(--color-gray-800); */
}
</style>

<template>
    <div class="cellContainer">
        <UCard
            :ref="`cells`"
            class="calendarCell rounded-none ring-gray-600"
            variant="outline"
            v-for="n in 7 * 24"
        />
    </div>
</template>
