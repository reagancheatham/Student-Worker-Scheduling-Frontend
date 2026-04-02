<script setup lang="ts">
    import { ref } from 'vue';

    const user = ref(JSON.parse(localStorage.getItem("user")));
    console.log(user);
</script>

<template>
    <div class="pl-6 pt-6 font-bold w-full text-xl">
        Welcome back, {{user?.firstName}}
    </div>
    <div class="flex flex-col gap-1 pt-6 pl-10">
        <UBadge size="lg" color="primary" class="w-75">
            Your Next Shift Starts Soon
        </UBadge>
        <div class="flex flex-row items-end gap-3">
            <UIcon name="i-lucide-calendar" class="size-5"/>
            <div>
                Thursday, July 25th
            </div>
        </div>
        <div class="flex flex-row items-end gap-3">
            <UIcon name="i-lucide-clock" class="size-5" />
            <div>
                9:00 A.M. - 2:00 P.M.
            </div>
        </div>
    </div>
    
</template>
