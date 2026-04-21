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
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: AuthServices.handleCredentialResponse,
                hosted_domain: "oc.edu",
                ux_mode: "popup",
                auto_select: false,
            });
        }
    }, 100);
});

function signInWithGoogle() {
    window.google?.accounts?.id.prompt();
}
</script>

<template>
    <UMain>
        <UContainer class="min-h-screen flex items-center justify-center">
            <UCard class="w-full max-w-md overflow-hidden" :ui="{ body: '!p-0' }">

                <!-- White/reactive top — logo + title -->
                <div class="flex flex-col items-center gap-4 px-10 py-10">
                    <img
                        src="/OCIcon.png"
                        alt="Oklahoma Christian University"
                        class="w-28 h-auto object-contain"
                    />
                    <div class="text-center">
                        <h1 class="text-2xl font-semibold tracking-tight text-(--ui-text)">
                            OC Scheduling
                        </h1>
                        <p class="text-(--ui-text-muted) text-sm mt-1 leading-relaxed">
                            Sign in with your Oklahoma Christian<br />credentials to continue.
                        </p>
                    </div>
                </div>

                <!-- Maroon bottom — sign in -->
                <div class="bg-[#7B1C1C] px-8 py-7 flex flex-col items-center gap-4">
                    <div class="flex items-center gap-3 w-full">
                        <div class="flex-1 h-px bg-white/20" />
                        <span class="text-xs text-white/50">continue with</span>
                        <div class="flex-1 h-px bg-white/20" />
                    </div>

                    <UButton
                        color="neutral"
                        variant="outline"
                        size="xl"
                        block
                        @click="signInWithGoogle"
                    >
                        <template #leading>
                            <img src="/google.svg" alt="Google" class="w-[1em] h-[1em]" />
                        </template>
                        Google
                    </UButton>

                    <p class="text-xs text-white/50 text-center leading-relaxed">
                        Use your
                        <UBadge color="neutral" variant="outline" size="xs" class="mx-0.5">
                            @oc.edu
                        </UBadge>
                        account. Access is restricted to authorized OC employees only.
                    </p>
                </div>

            </UCard>
        </UContainer>
    </UMain>
</template>