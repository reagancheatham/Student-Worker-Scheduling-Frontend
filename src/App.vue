<script setup lang="ts">
import { useColorMode } from '@nuxt/ui/runtime/vue/stubs/base.js';

const colorMode = useColorMode();
colorMode.preference = "light";
</script>

<template>
    <UApp>
        <UMain>
            <RouterView />
        </UMain>
        <UFooter />
    </UApp>
</template>
