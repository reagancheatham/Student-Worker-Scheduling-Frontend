<script lang="ts" setup>
import { User } from "@classes/database/user";
import { UserServices } from "../../services/userServices";
import { reactive, watchEffect } from "vue";
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";

const props = defineProps({
    user: {
        type: User,
        required: true,
    },
    onUpdated: {
        type: Function,
        required: false
    }
});

const schema = v.object({
    studentID: v.pipe(v.string(), v.length(7, "Must be a valid Student ID")),
    firstName: v.pipe(v.string()),
    lastName: v.pipe(v.string()),
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
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
});

watchEffect(() => {
    data.studentID = String(props.user.studentID ?? "");
    data.firstName = props.user.firstName ?? "";
    data.lastName = props.user.lastName ?? "";
    data.email = props.user.email ?? "";
    data.phoneNumber = props.user.phoneNumber?.replace(/\D/g, "") ?? "";
});

const emit = defineEmits<{
  close: []
  updated: [user: User]
}>();

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {

    //Schema already validates inputs
    const payload = new User(
        props.user.id,
        Number(data.studentID),
        props.user.permissionRoleID,
        data.firstName,
        data.lastName,
        data.email,
        data.phoneNumber, 
    );

    try {
        await UserServices.update(payload);

        toast.add({title: "User info updated!", color: 'green'});

        props.onUpdated?.(payload);
        emit("updated", payload);
        emit("close");
    } catch (err) {
        console.error(err);
        toast.add({title: "Update failed... Sorry, please try again later", color: 'red'});
    }
}
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
                    <UFormField label="First Name" name="firstName">
                        <UInput v-model="data.firstName" class="w-full" />
                    </UFormField>
                    <UFormField label="Last Name" name="lastName">
                        <UInput v-model="data.lastName" class="w-full" />
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
