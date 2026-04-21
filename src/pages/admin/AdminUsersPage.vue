<script setup lang="ts">
import { ref, shallowReactive, onMounted } from "vue";
import type { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import * as valibot from "valibot";
import { User } from "@classes/database/user.ts";
import { UserServices } from "../../services/userServices.ts";

type BusinessMembership = {
    id: number;
    businessName: string;
    role: string;
};

type UserRow = {
    id: number;
    fullName: string;
    studentId: number | null;
    email: string;
    phoneNumber: string;
    permissionRole: string;
    permissionRoleID: number;
    businesses: BusinessMembership[];
};

const data = ref<UserRow[]>([]);
const globalFilter = ref("");
const isEditOpen = ref(false);
const selectedUser = ref<UserRow | null>(null);
const toastNotification = useToast();

const editState = shallowReactive({
    firstName: "",
    lastName: "",
    studentID: "",
    phoneNumber: "",
});

const editValidationSchema = valibot.object({
    firstName: valibot.pipe(
        valibot.string(),
        valibot.nonEmpty("First name is required"),
    ),
    lastName: valibot.pipe(
        valibot.string(),
        valibot.nonEmpty("Last name is required"),
    ),
    studentID: valibot.optional(valibot.string()),
    phoneNumber: valibot.optional(valibot.string()),
});
type EditValidationSchema = valibot.InferOutput<typeof editValidationSchema>;

const columns: TableColumn<UserRow>[] = [
    {
        accessorKey: "fullName",
        header: "Full Name",
    },
    {
        accessorKey: "studentId",
        header: "Student ID",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone",
    },
    {
        accessorKey: "permissionRole",
        header: "Permission Role",
    },
    {
        accessorKey: "businesses",
        header: "Businesses",
    },
    {
        id: "actions",
        meta: { class: { td: "text-right" } },
    },
];

onMounted(() => {
    getData();
});

function openEditModal(row: UserRow) {
    selectedUser.value = row;
    const [firstName, ...rest] = row.fullName.split(" ");
    editState.firstName = firstName;
    editState.lastName = rest.join(" ");
    editState.studentID = row.studentId?.toString() ?? "";
    editState.phoneNumber = row.phoneNumber;
    isEditOpen.value = true;
}

function getRowActions(row: UserRow) {
    return [
        { type: "label" as const, label: "Actions" },
        {
            label: "Edit User",
            icon: "i-lucide-pencil",
            onSelect: () => openEditModal(row),
        },
        {
            label: "Delete User",
            icon: "i-lucide-trash-2",
            onSelect: () => deleteUser(row),
        },
    ];
}

async function deleteUser(userRow: UserRow) {
    await UserServices.delete(
        new User(
            userRow.id,
            userRow.studentId ?? 0,
            selectedUser.value?.permissionRoleID ?? 0,
            userRow.fullName.split(" ")[0],
            userRow.fullName.split(" ").slice(1).join(" "),
            userRow.email,
            userRow.phoneNumber,
        ),
    )
        .then(() => {
            toastNotification.add({
                title: "User Deleted",
                description: `Deleted ${userRow.fullName} successfully`,
            });
            getData();
        })
        .catch((err: any) => {
            toastNotification.add({
                title: "Delete failed",
                description: err?.message ?? "Could not delete user.",
                color: "error",
            });
        });
}

async function submitEdit(_: FormSubmitEvent<EditValidationSchema>) {
    if (!selectedUser.value) return;
    await UserServices.update(
        new User(
            selectedUser.value.id,
            parseInt(editState.studentID) || 0,
            selectedUser.value.permissionRoleID,
            editState.firstName,
            editState.lastName,
            selectedUser.value.email,
            editState.phoneNumber,
        ),
    )
        .then(() => {
            toastNotification.add({
                title: "User Updated",
                description: `Updated ${editState.firstName} ${editState.lastName} successfully`,
            });
            getData();
            isEditOpen.value = false;
        })
        .catch((err: any) => {
            toastNotification.add({
                title: "Update failed",
                description: err?.message ?? "Could not update user.",
                color: "error",
            });
        });
}

async function getData() {
    try {
        const users = await UserServices.getAll();
        data.value = users.map((user: any) => ({
            id: user.id,
            fullName: `${user.firstName} ${user.lastName}`,
            studentId: user.studentID ?? null,
            email: user.email,
            phoneNumber: user.phoneNumber,
            permissionRole: user.PermissionRole?.name ?? "—",
            permissionRoleID: user.permissionRoleID,
            businesses: (user.Employees ?? []).map((e: any) => ({
                id: e.Business?.id,
                businessName: e.Business?.name ?? "Unknown",
                role: e.BusinessPermissionRole?.name ?? "—",
            })),
        }));
    } catch (error) {
        console.error(`Error fetching users: ${error}`);
    }
}
</script>

<template>
    <div class="h-full flex flex-col">
        <div class="flex flex-row gap-2 mb-3">
            <UInput
                v-model="globalFilter"
                class="max-w-sm"
                placeholder="Search users..."
            />
        </div>

        <UTable
            sticky
            class="flex-1"
            v-model:global-filter="globalFilter"
            :data="data"
            :columns="columns"
        >
            <template #studentId-cell="{ row }">
                <span v-if="row.original.studentId">
                    {{ row.original.studentId }}
                </span>
                <span v-else class="text-muted-foreground italic text-sm">
                    —
                </span>
            </template>

            <template #businesses-cell="{ row }">
                <span
                    v-if="!row.original.businesses.length"
                    class="text-muted-foreground italic text-sm"
                >
                    None
                </span>
                <UDropdownMenu
                    v-else
                    :content="{ align: 'start' }"
                    :items="
                        row.original.businesses.map((b) => ({
                            label: b.businessName,
                            suffix: b.role,
                        }))
                    "
                >
                    <UButton
                        variant="subtle"
                        color="neutral"
                        size="sm"
                        trailing-icon="i-lucide-chevron-down"
                    >
                        {{ row.original.businesses.length }}
                        {{
                            row.original.businesses.length > 1
                                ? "Businesses"
                                : "Business"
                        }}
                    </UButton>
                </UDropdownMenu>
            </template>

            <template #actions-cell="{ row }">
                <div class="flex justify-end">
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

    <UModal
        v-model:open="isEditOpen"
        title="Edit User"
        description="Update user details"
    >
        <template #content>
            <div class="p-4">
                <UForm
                    :schema="editValidationSchema"
                    :state="editState"
                    class="flex flex-col gap-4"
                    @submit="submitEdit"
                >
                    <UFormField label="First Name" name="firstName">
                        <UInput v-model="editState.firstName" class="w-full" />
                    </UFormField>
                    <UFormField label="Last Name" name="lastName">
                        <UInput v-model="editState.lastName" class="w-full" />
                    </UFormField>
                    <UFormField label="Student ID" name="studentID">
                        <UInput
                            v-model="editState.studentID"
                            class="w-full"
                            placeholder="Optional"
                        />
                    </UFormField>
                    <UFormField label="Phone Number" name="phoneNumber">
                        <UInput
                            v-model="editState.phoneNumber"
                            class="w-full"
                        />
                    </UFormField>
                    <UFormField label="Email" name="email">
                        <UInput
                            :model-value="selectedUser?.email"
                            class="w-full"
                            disabled
                        />
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
</template>
