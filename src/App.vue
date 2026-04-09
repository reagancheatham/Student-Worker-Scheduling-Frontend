<script setup lang="ts">
import { useColorMode } from "@nuxt/ui/runtime/vue/stubs/base.js";
import { onMounted } from "vue";
import { AuthServices } from "./services/authServices.ts";

const colorMode = useColorMode();
colorMode.preference = "light";

declare global {
    interface Window {
        google: any;
    }
}

onMounted(() => {
    const checkGoogle = setInterval(() => {
        if (window.google?.accounts?.id) {
            clearInterval(checkGoogle);
            initializeGoogle();
        }
    }, 100);
});

function initializeGoogle() {
    window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: AuthServices.handleCredentialResponse,
        hosted_domain: "oc.edu",
        ux_mode: "popup",
        prompt_parent_id: "googleButton",
        auto_select: false,
    });
}
</script>

<template>
    <UApp>
        <UMain>
            <RouterView />
        </UMain>
        <UFooter />
    </UApp>
</template>
