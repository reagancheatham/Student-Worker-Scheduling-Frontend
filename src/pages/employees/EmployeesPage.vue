<script setup lang="ts">
import { onMounted, ref, shallowReactive } from "vue";
import { Employee } from "@classes/database/employee";
import { EmployeeServices } from "../../services/employeeServices.ts";
import { EmployeeUnavailabilityServices } from "../../services/employeeUnavailabilityServices.ts";
import { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import { h, resolveComponent } from "vue";
import { useClipboard } from "@vueuse/core";
import { Row } from "@tanstack/vue-table";
import { Store } from "@classes/util/store/store";
import * as v from "valibot";
import { Role } from "@classes/database/role.ts";
import { RoleServices } from "../../services/roleServices.ts";
import { TempStore } from "@classes/util/store/tempStore.ts";
import { UserClassServices } from "../../services/userClassServices.ts";

const toast = useToast();
const { copy } = useClipboard();
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const globalFilter = ref();
const deleteDoubleConfirm = ref(false);
const selectedEmployee = ref<Employee>();
const isRefreshOpen = ref(false);
const isRefreshingSchoolUnavailabilities = ref(false);

const isAddOpen = ref(false);
const isRoleEditOpen = ref(false);
const employees = ref<Employee[]>([]);
const roles = ref<Role[]>([]);
const newEditedRoleIDs = ref<number[]>([]);
const addState = shallowReactive({
    email: "",
    isManager: false,
});

const addValidationSchema = v.object({
    email: v.pipe(
        v.string(),
        v.nonEmpty("Email is required"),
        v.email("Invalid email address"),
    ),
    isManager: v.boolean(),
});
type AddValidationSchema = v.InferOutput<typeof addValidationSchema>;

const refreshState = shallowReactive({
    termCode: "",
});

const refreshValidationSchema = v.object({
    termCode: v.pipe(v.string(), v.nonEmpty("Term code is required")),
});
type RefreshValidationSchema = v.InferOutput<typeof refreshValidationSchema>;

const columns: TableColumn<Employee>[] = [
    {
        accessorKey: "studentID",
        header: "Student ID",
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
        id: "roles",
        header: "Roles",
        cell: ({ row }) => {
            return h(UButton, {
                icon: "i-lucide-pencil",
                color: "neutral",
                variant: "outline",
                label: "Edit Roles",
                onClick() {
                    selectedEmployee.value = row.original;
                    newEditedRoleIDs.value = row.original.roles.map(
                        (role) => role.id,
                    );
                    isRoleEditOpen.value = true;
                },
            });
        },
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

    employees.value = employees.value.filter(
        (e) => e.studentID !== selectedEmployee.value!.studentID,
    );
}

async function submitRefreshSchoolUnavailabilities(
    event: FormSubmitEvent<RefreshValidationSchema>,
) {
    const business = await Store.businessStore.get();

    if (!business) {
        toast.add({
            title: "Business not found",
            description: "Unable to refresh school unavailabilities.",
            color: "error",
            icon: "i-lucide-circle-alert",
        });
        return;
    }

    isRefreshingSchoolUnavailabilities.value = true;

    try {
        const response = await UserClassServices.importSchedulesForBusiness(
            business,
            event.data.termCode.trim(),
        );

        const payload = response?.data ?? {};
        const userErrors = Array.isArray(payload?.userErrors)
            ? payload.userErrors
            : [];

        if (userErrors.length > 0) {
            toast.add({
                title: "School unavailabilities refreshed",
                description:
                    userErrors[0]?.message ??
                    "Refresh completed with some errors.",
                color: "warning",
                icon: "i-lucide-triangle-alert",
            });
        } else {
            toast.add({
                title: "School unavailabilities refreshed",
                description: "Student schedules were imported successfully.",
                color: "success",
                icon: "i-lucide-circle-check",
            });
        }

        refreshState.termCode = "";
        isRefreshOpen.value = false;
    } catch (error) {
        console.error(`Error refreshing school unavailabilities: ${error}`);

        const responseData = (error as any)?.response?.data;
        const responseMessage =
            responseData?.message ??
            responseData?.Message ??
            "Could not import student schedules.";

        toast.add({
            title: "Refresh failed",
            description: responseMessage,
            color: "error",
            icon: "i-lucide-circle-alert",
        });
    } finally {
        isRefreshingSchoolUnavailabilities.value = false;
    }
}

async function submitAdd(_: FormSubmitEvent<AddValidationSchema>) {
    isAddOpen.value = false;

    await EmployeeServices.invite(addState.email, addState.isManager);

    getData();
}

async function submitRoleEdit(): Promise<void> {
    if (!selectedEmployee.value) return;

    TempStore.isLoading = true;
    isRoleEditOpen.value = false;

    const rolesToRemove: Role[] = [];
    const rolesToAdd: Role[] = [];

    const newEditedRoles = roles.value.filter((role) =>
        newEditedRoleIDs.value.includes(role.id),
    );

    selectedEmployee.value.roles.forEach((role) => {
        if (!newEditedRoles.includes(role)) rolesToRemove.push(role);
    });

    newEditedRoles.forEach((role) => {
        if (!selectedEmployee.value) return;

        if (!selectedEmployee.value.roles.includes(role)) rolesToAdd.push(role);
    });

    const promises: Promise<any>[] = [];

    rolesToRemove.forEach((role) => {
        if (!selectedEmployee.value) return;

        promises.push(
            RoleServices.deleteRoleFromEmployee(role, selectedEmployee.value),
        );
    });

    rolesToAdd.forEach((role) => {
        if (!selectedEmployee.value) return;

        promises.push(
            RoleServices.addRoleToEmployee(role, selectedEmployee.value),
        );
    });

    await Promise.all(promises);

    const index = employees.value.indexOf(selectedEmployee.value);
    if (index > -1)
        employees.value[index] = await EmployeeServices.get(
            selectedEmployee.value.id,
        );

    TempStore.isLoading = false;
}

async function getData() {
    const business = await Store.businessStore.get();

    if (!business) return;

    try {
        employees.value = await EmployeeServices.getAllForBusiness(business.id);
        roles.value = await RoleServices.getAllForBusiness(business.id);
    } catch (error: any) {
        console.error(`Error getting employees: ${error}`);
    }
}

onMounted(() => {
    getData();
});
</script>

<template>
    <UModal v-model:open="deleteDoubleConfirm" title="Are you sure?">
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

    <UModal
        v-model:open="isRefreshOpen"
        title="Refresh School Unavailabilities"
        description="Import the latest student schedule blocks for every employee in this business."
        close-icon="i-lucide-x"
    >
        <template #content>
            <div class="p-4">
                <UForm
                    :schema="refreshValidationSchema"
                    :state="refreshState"
                    class="flex flex-col gap-4"
                    @submit="submitRefreshSchoolUnavailabilities"
                >
                    <UFormField label="Term Code" name="termCode">
                        <UInput
                            v-model="refreshState.termCode"
                            placeholder="e.g. 2026SP"
                        />
                    </UFormField>

                    <div class="flex gap-2 justify-end">
                        <UButton
                            type="submit"
                            :loading="isRefreshingSchoolUnavailabilities"
                            :disabled="isRefreshingSchoolUnavailabilities"
                        >
                            Refresh
                        </UButton>

                        <UButton
                            variant="outline"
                            color="neutral"
                            @click="isRefreshOpen = false"
                        >
                            Cancel
                        </UButton>
                    </div>
                </UForm>
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
                label="Refresh Unavailabilities"
                color="neutral"
                variant="outline"
                icon="i-lucide-refresh-cw"
                @click="isRefreshOpen = true"
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
            :data="employees"
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
    <UModal
        v-model:open="isRoleEditOpen"
        title="Edit Employee Roles"
        :ui="{ content: 'sm:max-w-sm' }"
    >
        <template #body>
            <USelectMenu
                v-if="selectedEmployee"
                v-model="newEditedRoleIDs"
                class="min-w-32"
                label-key="name"
                value-key="id"
                :items="roles"
                multiple
            />
        </template>
        <template #footer>
            <div class="ml-auto flex flex-row gap-2">
                <UButton @click="submitRoleEdit()"> Submit </UButton>
                <UButton
                    variant="outline"
                    color="neutral"
                    @click="isRoleEditOpen = false"
                >
                    Cancel
                </UButton>
            </div>
        </template>
    </UModal>
</template>
