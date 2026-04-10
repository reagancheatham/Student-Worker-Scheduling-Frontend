<script lang="ts" setup>
import { User } from "@classes/database/user";
import { reactive, watchEffect } from "vue";
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";

const props = defineProps({
    user: {
        type: User,
        required: true,
    },
});

const schema = v.object({
    studentID: v.pipe(v.string(), v.length(7, "Must be a valid Student ID")),
    name: v.pipe(v.string()),
    email: v.pipe(v.string(), v.email("Invalid Email")),
    phoneNumber: v.pipe(
        v.string(),
        v.regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
    ),
});

type Schema = v.InferOutput<typeof schema>;

//only initialized once during setup, meaning watchEffect() is needed
const data = reactive({
    studentID: "",
    name: "",
    email: "",
    phoneNumber: "",
});

watchEffect(() => {
    data.studentID = String(props.user.studentID ?? "");
    data.name = props.user.fullName ?? "";
    data.email = props.user.email ?? "";
    data.phoneNumber = props.user.phoneNumber?.replace(/\D/g, "") ?? "";
});

async function onSubmit(event: FormSubmitEvent<Schema>) {}
</script>

<template>
    <UModal size="lg">
        <template #title>
            {{ user.fullName }}
        </template>
        <template #body>
            <div class="flex flex-col items-center w-full">
                <UForm
                    :schema="schema"
                    :state="data"
                    @submit="onSubmit"
                    class="w-full max-w-xl"
                >
                    <UFormField label="Student ID" name="studentID">
                        <UInput v-model="data.studentID" class="w-full" />
                    </UFormField>
                    <UFormField label="Name" name="name">
                        <UInput v-model="data.name" class="w-full" />
                    </UFormField>
                    <UFormField label="Email" name="email">
                        <UInput v-model="data.email" class="w-full" />
                    </UFormField>
                    <UFormField label="Phone Number" name="phoneNumber">
                        <UInput v-model="data.phoneNumber" class="w-full" />
                    </UFormField>
                    <div
                        class="flex flex-row w-full justify-center items-center gap-10 pt-8"
                    >
                        <UButton
                            class="w-24 justify-center"
                            size="lg"
                            type="submit"
                        >
                            Save
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UModal>
</template>
