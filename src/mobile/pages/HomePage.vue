<script setup lang="ts">
    import { ref } from 'vue';

    const user = ref(JSON.parse(localStorage.getItem("user")));
    console.log(user);
</script>

<template>
    <div class="pl-6 pt-6 font-bold w-full text-xl">
        Welcome back, {{user?.firstName}}
    </div>
</template>
