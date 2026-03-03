<script setup>
import { ref } from 'vue';
import type { ButtonProps } from '@nuxt/ui'

const providers =
    ref <
    ButtonProps >
    [
        {
            label: "Google",
            icon: "i-simple-icons-google",
            color: "neutral",
            variant: "subtle",
        },
    ];
</script>
<template>
    <div>
        <UAuthForm
            title="Login"
            description="Please enter your Oklahoma Christian credentials to continue."
            icon="i-lucide-user"
            :providers="providers"
        />
    </div>
</template>
