<script setup lang="ts">
import { ref, h, resolveComponent, shallowReactive, onMounted } from "vue";
import type { Row } from "@tanstack/vue-table";
import { Business } from "@classes/database/business";
import { EmployeeServices } from "../services/employeeServices";
import * as valibot from "valibot";
import { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import { BusinessServices } from "../services/businessServices.ts";

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
type BusinessRow = {
    id: number;
    name: string;
    ownerName: string;
    ownerPhoneNumber: string;
    ownerEmail: string;
};

const data = ref<BusinessRow[]>([]);
const globalFilter = ref("");
const isEditOpen = ref(false);
const selectedBusiness = ref<BusinessRow | null>(null);
const isAddOpen = ref(false);
const toastNotification = useToast();
const addState = shallowReactive({
    name: "",
    email: "",
});
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

const addValidationSchema = valibot.object({
    name: valibot.pipe(valibot.string(), valibot.nonEmpty("Name is required")),
    email: valibot.pipe(
        valibot.string(),
        valibot.nonEmpty("Email is required"),
        valibot.email("Invalid email address"),
    ),
});

type AddValidationSchema = valibot.InferOutput<typeof editValidationSchema>;

const columns: TableColumn<BusinessRow>[] = [
    {
        accessorKey: "id",
        header: "ID",
        meta: {
            class: {
                th: "w-[20%]",
                td: "whitespace-normal",
            },
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        meta: {
            class: {
                th: "w-[60%]",
                td: "whitespace-normal",
            },
        },
    },
    {
        accessorKey: "ownerName",
        header: "Owner Name",
        meta: {
            class: {
                th: "w-[5%]",
            },
        },
    },
    {
        accessorKey: "ownerPhoneNumber",
        header: "Owner Phone Number",
        meta: {
            class: {
                th: "w-[5%]",
            },
        },
    },
    {
        accessorKey: "ownerEmail",
        header: "Owner Email",
        meta: {
            class: {
                th: "w-[5%]",
            },
        },
    },
    {
        id: "actions",
        meta: {
            class: {
                th: "w-[5%]",
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

onMounted(() => {
    getData();
});

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
                await deleteBusiness(
                    new Business(row.original.id, row.original.name),
                );
                getData();
            },
        },
    ];
}

async function deleteBusiness(business: Business) {
    await BusinessServices.delete(business)
        .then(async () => {
            toastNotification.add({
                title: "Deleted Business",
                description: `Successfully deleted business ${JSON.stringify(business)}`,
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

async function submitEdit(_: FormSubmitEvent<EditValidationSchema>) {
    if (!selectedBusiness.value) return;
    await BusinessServices.update(
        new Business(selectedBusiness.value.id, editState.name),
        editState.email,
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

async function submitAdd(event: FormSubmitEvent<AddValidationSchema>) {
    await BusinessServices.create(
        new Business(-1, addState.name),
        addState.email,
    );

    isAddOpen.value = false;
}

async function getData() {
    try {
        const owners = await EmployeeServices.getAllOwners();

        const rows = owners.map((owner) => {
            return {
                id: owner.business.id,
                name: owner.business.name,
                ownerName: owner.employee.fullName,
                ownerPhoneNumber: owner.employee.formattedPhoneNumber,
                ownerEmail: owner.employee.email,
            };
        });

        data.value = rows;
    } catch (error) {
        console.error(`Error getting owners: ${error}`);
    }
}
</script>

<template>
    <UDashboardPanel>
        <template #header>
            <ScheduleNavbar />
        </template>

        <template #body class="overflow-hidden!">
            <div class="h-screen flex flex-col">
                <div class="flex flex-row">
                    <UInput
                        v-model="globalFilter"
                        class="max-w-sm"
                        placeholder="Search all columns..."
                    />
                    <UButton label="Add Business" @click="isAddOpen = true" />
                </div>
                <UTable
                    sticky
                    class="flex-1"
                    v-model:global-filter="globalFilter"
                    ref="table"
                    :data="data"
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
