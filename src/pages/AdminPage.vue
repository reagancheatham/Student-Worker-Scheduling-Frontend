<script setup lang="ts">
import {
    ref,
    h,
    resolveComponent,
    shallowReactive,
} from "vue";
import type { Row } from "@tanstack/vue-table";
import { Business } from "@classes/database/business";
import { Employee } from "@classes/database/employee";
import { EmployeeServices } from "../services/employeeServices";
import { BusinessServices } from "../services/businessService";
import * as valibot from "valibot";
import { FormSubmitEvent } from "@nuxt/ui";

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

type BusinessRow = {
    id: number;
    name: string;
    ownerName: string;
    ownerPhoneNumber: string;
    ownerEmail: string;
};
let data = ref<BusinessRow[]>([]);
const toastNotification = useToast();
const globalFilter = ref("");

//MODAL STUFF-----------------
const isEditOpen = ref(false);
const selectedBusiness = ref<BusinessRow | null>(null);
const editState = shallowReactive({
    name: "",
    email: "",
});
const editValidationSchema = valibot.object({
    name: valibot.pipe(valibot.string(), valibot.nonEmpty("Name is required")),
    email: valibot.pipe(
        valibot.string(),
        valibot.nonEmpty("Email is required"),
        valibot.email("Invalid email address"),
    ),
});
type EditValidationSchema = valibot.InferOutput<typeof editValidationSchema>;
const isAddOpen = ref(false);
const addState = shallowReactive({
    name: "",
    email: ""
});
const addValidationSchema = valibot.object({
    name: valibot.pipe(valibot.string(), valibot.nonEmpty("Name is required")),
    email: valibot.pipe(
        valibot.string(),
        valibot.nonEmpty("Email is required"),
        valibot.email("Invalid email address"),
    ),
});
type AddValidationSchema = valibot.InferOutput<typeof editValidationSchema>;

//TABLE ITEMS--------------------
const columns = [
    {
        accessorKey: "id",
        header: "ID",
        meta: { class: "w-[20%] whitespace-normal" },
    },
    {
        accessorKey: "name",
        header: "Name",
        meta: { style: "w-[60%] whitespace-normal" },
    },
    {
        accessorKey: "ownerName",
        header: "Owner Name",
        width: "5%",
    },
    {
        accessorKey: "ownerPhoneNumber",
        header: "Owner Phone Number",
        width: "5%",
    },
    {
        accessorKey: "ownerEmail",
        header: "Owner Email",
        width: "5%",
    },
    {
        id: "actions",
        width: "5%",
        meta: {
            class: {
                td: "text-right",
            },
        },
        cell: ({ row }: { row: Row<BusinessRow> }) => {
            return h(
                UDropdownMenu,
                {
                    content: {
                        align: "end",
                    },
                    items: getRowItems(row),
                    "aria-label": "Actions dropdown",
                },
                () =>
                    h(UButton, {
                        icon: "i-lucide-ellipsis-vertical",
                        color: "neutral",
                        variant: "ghost",
                        "aria-label": "Actions dropdown",
                    }),
            );
        },
    },
];

function getRowItems(row: Row<BusinessRow>) {
    return [
        {
            type: "label",
            label: "Actions",
        },
        {
            label: "Edit Business",
            onSelect() {
                selectedBusiness.value = row.original;
                editState.name = row.original.name;
                isEditOpen.value = true;
            },
        },
        {
            label: "Delete Business",
            async onSelect() {
                await deleteBusiness(row.original.id);
                getData();
            },
        },
    ];
}

//DELETE BUSINESS----------------------------
async function deleteBusiness(id: number) {
    await BusinessServices.delete(id)
        .then(async () => {
            toastNotification.add({
                title: "Deleted Business",
                description: `Successfully deleted business ${id}`,
            });
        })
        .catch((err) =>
            toastNotification.add({
                title: "Delete failed",
                description:
                    err?.response?.data?.message ??
                    "Could not delete business.",
                color: "error",
            }),
        );
}
//EDIT BUSINESS-----------------------------
async function submitEdit(event: FormSubmitEvent<EditValidationSchema>) {
    if (!selectedBusiness.value) return;
    await BusinessServices.update(
        new Business(selectedBusiness.value.id, editState.name), editState.email
    )
        .then(() => {
            toastNotification.add({
                title: "Business Updated",
                description: `Updated ${editState.name} successfully`,
            });

            getData();
            isEditOpen.value = false;
        })
        .catch((err: any) => {
            toastNotification.add({
                title: "Update failed",
                description: err?.message ?? "Could not update business.",
                color: "error",
            });
        });
}
//ADD BUSINESS-------------------------
async function submitAdd(event: FormSubmitEvent<AddValidationSchema>) {
    await BusinessServices.create(new Business(-1, addState.name), addState.email)
}

//GET DATA----------
async function getData() {
    await EmployeeServices.getAllOwners()
        .then((owners: any[]) => {
            const rows = owners.map((owner) => {
                const ownerEmployee = new Employee(
                    owner.id,
                    owner.User.studentID,
                    owner.User.firstName,
                    owner.User.lastName,
                    owner.User.email,
                    owner.User.phoneNumber,
                );

                return {
                    id: owner.Business.id,
                    name: owner.Business.name,
                    ownerName: ownerEmployee.fullName,
                    ownerPhoneNumber: ownerEmployee.formattedPhoneNumber,
                    ownerEmail: ownerEmployee.email,
                };
            });

            data.value = rows;
        })
        .catch((err) => {
            console.error(err);
        });
}
getData();
</script>

<template>
    <UDashboardPanel>
        <template #header>
            <ScheduleNavbar />
        </template>

        <template #body class="overflow-hidden!">
            <div class="h-screen flex flex-col">
                <UInput
                    v-model="globalFilter"
                    class="max-w-sm"
                    placeholder="Search all columns..."
                />
                <UButton label="Add Business" @click="isAddOpen = true" />
                <UTable
                    sticky
                    class="flex-1"
                    v-model:global-filter="globalFilter"
                    :data="data"
                    ref="table"
                    :columns="columns"
                />
            </div>
        </template>
    </UDashboardPanel>
    <UModal
        v-model:open="isEditOpen"
        title="Edit Business"
        description="Update business details"
    >
        <template #content>
            <div class="p-4">
                <UForm
                    :schema="editValidationSchema"
                    :state="editState"
                    class="flex flex-col gap-4"
                    @submit="submitEdit"
                >
                    <UFormField label="Business Name" name="name">
                        <UInput v-model="editState.name" />
                    </UFormField>
                    <UFormField label="Business Owner Name" name="name">
                        <UInput v-model="editState.email" />
                    </UFormField>

                    <div class="flex gap-2 justify-end">
                        <UButton type="submit"> Save </UButton>

                        <UButton
                            variant="outline"
                            color="neutral"
                            @click="isEditOpen = false"
                        >
                            Cancel
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UModal>
    <UModal v-model:open="isAddOpen" title="Add Business">
        <template #content>
            <div class="p-4">
                <UForm
                    :schema="addValidationSchema"
                    :state="addState"
                    class="flex flex-col gap-4"
                    @submit="submitAdd"
                >
                    <UFormField label="Business Name" name="name">
                        <UInput v-model="addState.name" />
                    </UFormField>
                    <UFormField label="Business Owner Email" name="email">
                        <UInput v-model="addState.email" />
                    </UFormField>

                    <div class="flex gap-2 justify-end">
                        <UButton type="submit"> Save </UButton>

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
