<script setup lang="ts">
import { shallowRef } from "vue";
import type { ButtonProps } from "@nuxt/ui";

const providers = shallowRef<ButtonProps[]>([
    {
        label: "Google",
        icon: "i-lucide-google",
        color: "neutral",
        variant: "subtle",
    }
]);

AuthSer
</script>

<template>
    <div class="flex flex-col items-center justify-center gap-4 p-4">
        <UPageCard class="w-full max-w-md">
            <UAuthForm
                title="Login"
                description="Please enter your Oklahoma Christian credentials to continue."
                icon="i-lucide-user"
                :providers="providers"
            />
        </UPageCard>
    </div>
</template>
