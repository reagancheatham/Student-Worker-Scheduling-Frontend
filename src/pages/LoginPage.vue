<script setup lang="ts">
import { useHead } from "@nuxt/ui/runtime/vue/stubs/base.js";
import { onMounted } from "vue";
import { AuthServices } from "../services/authServices.ts";

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
    window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: AuthServices.handleCredentialResponse,
        hosted_domain: "oc.edu",
        ux_mode: "popup",
        prompt_parent_id: "googleButton",
        auto_select: false,
    });
    window.google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        {
            theme: "outline",
            size: "large",
            width: "320",
        },
    );
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-(--ui-bg-muted) p-6">
        <UCard class="w-full max-w-lg overflow-hidden" :ui="{ body: '!p-0' }">
            <div class="px-10 py-10 flex flex-col items-center gap-5">
                <img
                    src="../../public/OCIcon.png"
                    alt="Oklahoma Christian University"
                    class="w-28 h-auto object-contain"
                />
                <div class="text-center">
                    <h1 class="text-3xl font-semibold tracking-tight text-(--ui-text)">
                        OC Scheduling
                    </h1>
                    <p class="text-(--ui-text-muted) text-base mt-2 leading-relaxed">
                        Sign in with your Oklahoma Christian<br />credentials to continue.
                    </p>
                </div>
            </div>
            <div class="bg-[#7B1C1C] px-10 py-8 flex flex-col items-center gap-5">
                <div class="flex items-center gap-3 w-full">
                    <div class="flex-1 h-px bg-white/20" />
                    <span class="text-sm text-white/60">continue with</span>
                    <div class="flex-1 h-px bg-white/20" />
                </div>
                <div id="googleButton" class="flex justify-center w-full" />
                <p class="text-sm text-white/50 text-center leading-relaxed">
                    Use your <span class="font-medium text-white/80">@oc.edu</span> account.
                    Access is restricted to authorized OC employees only.
                </p>
            </div>

        </UCard>
    </div>
</template>