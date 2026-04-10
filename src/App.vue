<script setup lang="ts">
import { Store } from "@classes/util/store.ts";
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

onMounted(async () => {
    const user = Store.getUser();

    if (!user || !user.token)
        return;

    const isValid = await AuthServices.validateSession();

    if (!isValid)
        Store.clear();
    else
        console.log("valid session");
});
</script>

<template>
    <UApp>
        <UMain>
            <RouterView />
        </UMain>
        <UFooter />
    </UApp>
</template>
