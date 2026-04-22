<script setup lang="ts">
import { Role } from "@classes/database/role.ts";
import { Store } from "@classes/util/store/store.ts";
import { h, onMounted, ref, resolveComponent, shallowReactive } from "vue";
import { RoleServices } from "../../services/roleServices.ts";
import { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import * as v from "valibot";
import { TempStore } from "@classes/util/store/tempStore.ts";
import { Business } from "@classes/database/business.ts";
import { Row } from "@tanstack/vue-table";

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const globalFilter = ref();
const isModalOpen = ref(false);
const isCreatingRole = ref(false);
const editedRole = ref<Role>(createDefaultRole());
const roles = ref<Role[]>([]);

let business: Business;

const columns: TableColumn<Role>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        id: "action",
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
                    items: getActionItems(row),
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

const schema = v.object({
    name: v.pipe(v.string(), v.nonEmpty("Name is required")),
});
type RoleSchema = v.InferOutput<typeof schema>;

const state = shallowReactive<{
    name: string;
}>({ name: editedRole.value.name });

onMounted(async () => {
    const storeBusiness = await Store.businessStore.get();

    if (!storeBusiness) return;

    business = storeBusiness;

    try {
        const result = await RoleServices.getAllForBusiness(business.id);

        roles.value = result;
    } catch (error: any) {
        console.error(`Error getting roles: ${error}`);
    }
});

function getActionItems(row: Row<Role>) {
    return [
        [
            {
                label: "Edit",
                icon: "i-lucide-pencil",
                onSelect: () => openEditModal(row.original),
            },
        ],
        [
            {
                label: "Delete",
                icon: "i-lucide-trash",
                color: "error",
                onSelect: () => deleteRole(row.original),
            },
        ],
    ];
}

function openAddModal(): void {
    isCreatingRole.value = true;
    editedRole.value = createDefaultRole();
    isModalOpen.value = true;
}

function openEditModal(role: Role): void {
    isCreatingRole.value = false;
    editedRole.value = role;
    state.name = role.name;

    isModalOpen.value = true;
}

function createDefaultRole(): Role {
    return new Role(0, 0, "New Role");
}

async function deleteRole(role: Role): Promise<void> {
    TempStore.isLoading = true;

    await RoleServices.delete(role);

    const index = roles.value.indexOf(role);

    if (index !== -1) roles.value.splice(index, 1);

    TempStore.isLoading = false;
}

async function submitModalForm(_: FormSubmitEvent<RoleSchema>): Promise<void> {
    TempStore.isLoading = true;
    const name = state.name;

    isModalOpen.value = false;

    let role = editedRole.value;
    role.name = name;
    role.businessID = business.id;

    try {
        if (isCreatingRole.value) {
            role = await RoleServices.create(role);

            roles.value.push(role);
            roles.value.sort((a, b) => a.name.localeCompare(b.name));
        } else await RoleServices.update(role);
    } catch (error: any) {
        console.error(
            `Error ${isCreatingRole.value ? "creating" : "editing"} ${Role.name}: ${error}`,
        );
    }

    TempStore.isLoading = false;
}
</script>

<template>
    <div class="w-full self-center justify-self-center">
        <div
            class="flex justify-between px-4 py-3.5 border-b border-accented gap-4"
        >
            <UInput
                v-model="globalFilter"
                class="max-w-sm"
                placeholder="Filter..."
            />

            <UButton label="Add Role" color="primary" @click="openAddModal()" />
        </div>
        <UTable
            :columns="columns"
            :data="roles"
            ref="table"
            v-model:global-filter="globalFilter"
        />
    </div>
    <UModal
        :open="isModalOpen"
        :title="isCreatingRole ? 'Add Role' : 'Edit Role'"
        :ui="{ content: 'sm:max-w-xs' }"
    >
        <template #content>
            <div class="p-4">
                <UForm
                    :schema="schema"
                    :state="state"
                    class="flex flex-col gap-4"
                    @submit="submitModalForm"
                >
                    <UFormField label="Name" name="name">
                        <UInput v-model="state.name" />
                    </UFormField>
                    <div class="flex gap-2 justify-end">
                        <UButton type="submit"> Add </UButton>

                        <UButton
                            variant="outline"
                            color="neutral"
                            @click="isModalOpen = false"
                        >
                            Cancel
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UModal>
</template>
