<script lang="ts" setup>
import { User } from '@classes/database/user';

const props = defineProps({
    user: {
        type: User,
        required: true
    }
});
</script>

<template>
    <UModal>
        This is a modal
    </UModal>
</template>
