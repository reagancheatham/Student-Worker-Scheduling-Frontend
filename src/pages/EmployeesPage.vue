<script setup lang="ts">
import { onMounted, ref, shallowReactive } from "vue";
import { Employee } from "@classes/database/employee";
import { EmployeeServices } from "../services/employeeServices";
import { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import { h, resolveComponent } from "vue";
import { useClipboard } from "@vueuse/core";
import { Row } from "@tanstack/vue-table";
import { Store } from "@classes/util/store.ts";
import * as valibot from "valibot";

const toast = useToast();
const { copy } = useClipboard();
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const globalFilter = ref();
const deleteDoubleConfirm = ref(false);
const selectedEmployee = ref<Employee>();

const isAddOpen = ref(false);
const addState = shallowReactive({
    email: "",
    isManager: false,
});
const addValidationSchema = valibot.object({
    email: valibot.pipe(
        valibot.string(),
        valibot.nonEmpty("Email is required"),
        valibot.email("Invalid email address"),
    ),
    isManager: valibot.boolean(),
});
type AddValidationSchema = valibot.InferOutput<typeof addValidationSchema>;
const toastNotification = useToast();

let data = ref<Employee[]>([]);

const columns: TableColumn<Employee>[] = [
    {
        accessorKey: "studentID",
        header: "ID",
    },
    {
        id: "name",
        accessorKey: "fullName",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        cell: ({ row }) => row.original.formattedPhoneNumber,
    },
    {
        id: "actions",
        meta: {
            class: {
                td: "text-right",
            },
        },
        cell: ({ row }) => {
            return h(
                UDropdownMenu,
                {
                    content: {
                        align: "end",
                    },
                    items: getRowItems(row),
                },
                () =>
                    h(UButton, {
                        icon: "i-lucide-ellipsis-vertical",
                        color: "neutral",
                        variant: "ghost",
                    }),
            );
        },
    },
];

function getRowItems(row: Row<Employee>) {
    return [
        [
            {
                label: "Copy Student ID",
                icon: "i-lucide-copy",
                onSelect() {
                    copy(row.original.studentID);

                    toast.add({
                        title: "Employee ID copied to clipboard!",
                        color: "success",
                        icon: "i-lucide-circle-check",
                    });
                },
            },
            {
                label: "Copy Email",
                icon: "i-lucide-copy",
                onSelect() {
                    copy(row.original.email);

                    toast.add({
                        title: "Employee Email copied to clipboard!",
                        color: "success",
                        icon: "i-lucide-circle-check",
                    });
                },
            },
        ],
        [
            {
                label: "Delete",
                icon: "i-lucide-trash",
                color: "error",
                onSelect() {
                    openDoubleConfirm(row.original);
                },
            },
        ],
    ];
}

function openDoubleConfirm(employee: Employee) {
    deleteDoubleConfirm.value = true;
    selectedEmployee.value = employee;
}

function deleteEmployee() {
    if (!selectedEmployee.value) return;

    EmployeeServices.delete(selectedEmployee.value);
    deleteDoubleConfirm.value = false;

    data.value = data.value.filter(
        (e) => e.studentID !== selectedEmployee.value!.studentID,
    );
}

async function submitAdd(event: FormSubmitEvent<AddValidationSchema>) {
    await EmployeeServices.create(addState.email, addState.isManager).then(
        () => {
            getData();
            isAddOpen.value = false;
        },
    );
}

function getData() {
    EmployeeServices.getAllForBusiness(Store.getBusiness()!.id)
        .then((result) => {
            data.value = result;
            console.log(data);
        })
        .catch((err) => {
            console.error(err);
        });
}
onMounted(() => {
    getData();
});
</script>

<template>
    <UModal
        v-model:open="deleteDoubleConfirm"
        title="Are you sure?"
        close-icon="i-lucide-x"
    >
        <template #body>
            <div class="text-center text-2xl font-medium">
                Are you sure you want to delete
                <br />
                {{ selectedEmployee!.fullName }}?
            </div>
            <div class="flex justify-center gap-4 pt-4">
                <UButton
                    label="Yes"
                    color="primary"
                    @click="deleteEmployee()"
                />
                <UButton
                    label="No"
                    color="neutral"
                    variant="outline"
                    @click="deleteDoubleConfirm = false"
                />
            </div>
        </template>
    </UModal>

    <div class="h-screen flex flex-col">
        <div class="flex justify-between px-4 py-3.5 border-b border-accented">
            <UInput
                v-model="globalFilter"
                class="max-w-sm"
                placeholder="Filter..."
            />

            <UButton
                label="Add Employee"
                color="primary"
                @click="isAddOpen = true"
            />
        </div>
        <UTable
            class="flex-1"
            :columns="columns"
            :data="data"
            ref="table"
            v-model:global-filter="globalFilter"
        >
            <template #name-cell="{ row }">
                <div class="flex items-c>enter gap-3">
                    <UAvatar
                        class="bg-maroon-500"
                        :ui="{ fallback: 'text-neutral-100' }"
                        :alt="row.original.firstName"
                    />
                    <div class="font-medium pt-1.5">
                        {{ row.original.fullName }}
                    </div>
                </div>
            </template>
        </UTable>
    </div>
    <UModal v-model:open="isAddOpen" title="Add Business">
        <template #content>
            <div class="p-4">
                <UForm
                    :schema="addValidationSchema"
                    :state="addState"
                    class="flex flex-col gap-4"
                    @submit="submitAdd"
                >
                    <UFormField label="Employee Email" name="email">
                        <UInput v-model="addState.email" />
                    </UFormField>
                    <UFormField name="isManager">
                        <div class="flex items-center gap-2">
                            <USwitch v-model="addState.isManager" />
                            <span class="text-sm">Make Manager</span>
                        </div>
                    </UFormField>
                    <div class="flex gap-2 justify-end">
                        <UButton type="submit"> Add </UButton>

                        <UButton
                            variant="outline"
                            color="neutral"
                            @click="isAddOpen = false"
                        >
                            Cancel
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UModal>
</template>
