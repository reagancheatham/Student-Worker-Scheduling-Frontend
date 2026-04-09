<script setup lang="ts">
import { useHead } from "@nuxt/ui/runtime/vue/stubs/base.js";
import { onMounted } from "vue";

useHead({
    script: [
        {
            src: "https://accounts.google.com/gsi/client",
            async: true,
            defer: true,
        },
    ],
});

onMounted(() => {
    const checkGoogle = setInterval(() => {
        if (window.google?.accounts?.id) {
            clearInterval(checkGoogle);
            createLoginButton();
        }
    }, 100);
});

function createLoginButton() {
    window.google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        {
            theme: "outline",
            size: "large",
        },
    );
}
</script>

<template>
    <div class="mt-36 flex flex-col items-center justify-center gap-4 p-4">
        <UPageCard class="w-full max-w-md">
            <UAuthForm
                title="Scheduler Login"
                description="Please enter your Oklahoma Christian credentials to continue."
                icon="i-lucide-user"
            />
            <div id="googleButton"></div>
        </UPageCard>
    </div>
</template>
