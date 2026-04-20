<script setup lang="ts">
import { ref, shallowReactive, onMounted } from "vue";
import { Business } from "@classes/database/business";
import { EmployeeServices } from "../services/employeeServices";
import * as valibot from "valibot";
import { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import { BusinessServices } from "../services/businessServices.ts";
import { Store } from "@classes/util/store/store.ts";
import { router } from "../routing/router.ts";
import { routes, subRoutes } from "../routing/routes.ts";

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

const addState = shallowReactive({ name: "", email: "" });
const editState = shallowReactive({ name: "", email: "" });

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
type AddValidationSchema = valibot.InferOutput<typeof addValidationSchema>;

const columns: TableColumn<BusinessRow>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "ownerName", header: "Owner Name" },
    { accessorKey: "ownerPhoneNumber", header: "Owner Phone" },
    { accessorKey: "ownerEmail", header: "Owner Email" },
    {
        id: "actions",
        meta: { class: { td: "text-right" } },
    },
];

onMounted(() => {
    getData();
});

function getRowActions(business: BusinessRow) {
    return [
        { type: "label" as const, label: "Actions" },
        {
            label: "Edit Business",
            icon: "i-lucide-pencil",
            onSelect() {
                selectedBusiness.value = business;
                editState.name = business.name;
                isEditOpen.value = true;
            },
        },
        {
            label: "Delete Business",
            icon: "i-lucide-trash-2",
            async onSelect() {
                await deleteBusiness(new Business(business.id, business.name));
                getData();
            },
        },
    ];
}

async function deleteBusiness(business: Business) {
    await BusinessServices.delete(business)
        .then(() => {
            toastNotification.add({
                title: "Deleted Business",
                description: `Successfully deleted ${business.name}`,
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

async function submitAdd(_: FormSubmitEvent<AddValidationSchema>) {
    await BusinessServices.create(
        new Business(-1, addState.name),
        addState.email,
    )
        .then(() => {
            toastNotification.add({
                title: "Business Added",
                description: `Added ${addState.name} successfully`,
            });
            getData();
            isAddOpen.value = false;
        })
        .catch((err: any) => {
            toastNotification.add({
                title: "Add failed",
                description: err?.message ?? "Could not add business.",
                color: "error",
            });
        });
}

async function getData() {
    try {
        const owners = await EmployeeServices.getAllOwners();
        data.value = owners.map((owner) => ({
            id: owner.business.id,
            name: owner.business.name,
            ownerName: owner.employee.fullName,
            ownerPhoneNumber: owner.employee.formattedPhoneNumber,
            ownerEmail: owner.employee.email,
        }));
    } catch (error) {
        console.error(`Error getting owners: ${error}`);
    }
}

async function viewBusiness(businessID: number) {
    const business = await BusinessServices.get(businessID);
    Store.businessStore.set(business);
    router.push(routes.NavbarLayout);
}
</script>

<template>
    <div class="h-full flex flex-col">
        <div class="flex flex-row gap-2 mb-3">
            <UInput
                v-model="globalFilter"
                class="max-w-sm"
                placeholder="Search businesses..."
            />
            <UButton
                icon="i-lucide-plus"
                label="Add Business"
                @click="isAddOpen = true"
            />
        </div>

        <UTable
            sticky
            class="flex-1"
            v-model:global-filter="globalFilter"
            :data="data"
            :columns="columns"
        >
            <template #actions-cell="{ row }">
                <div class="flex items-center justify-end gap-2">
                    <UButton
                        icon="i-lucide-eye"
                        label="View"
                        size="sm"
                        @click="viewBusiness(row.original.id)"
                    />
                    <UDropdownMenu
                        :content="{ align: 'end' }"
                        :items="getRowActions(row.original)"
                        aria-label="Actions dropdown"
                    >
                        <UButton
                            icon="i-lucide-ellipsis-vertical"
                            color="neutral"
                            variant="ghost"
                            size="sm"
                            aria-label="Actions dropdown"
                        />
                    </UDropdownMenu>
                </div>
            </template>
        </UTable>
    </div>

    <!-- Edit Modal -->
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
                        <UInput v-model="editState.name" class="w-full" />
                    </UFormField>
                    <UFormField label="Owner Email" name="email">
                        <UInput v-model="editState.email" class="w-full" />
                    </UFormField>
                    <div class="flex gap-2 justify-end">
                        <UButton type="submit">Save</UButton>
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

    <!-- Add Modal -->
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
                        <UInput v-model="addState.name" class="w-full" />
                    </UFormField>
                    <UFormField label="Business Owner Email" name="email">
                        <UInput v-model="addState.email" class="w-full" />
                    </UFormField>
                    <div class="flex gap-2 justify-end">
                        <UButton type="submit">Save</UButton>
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
