<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { Invite } from "@classes/database/invite";
import { InviteServices } from "../../services/inviteServices.ts";

type InviteRow = {
    code: number;
    email: string;
    role: string;
    businessName: string;
};

const data = ref<InviteRow[]>([]);
const globalFilter = ref("");
const toastNotification = useToast();

const columns: TableColumn<InviteRow>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "businessName", header: "Business" },
    {
        id: "actions",
        meta: { class: { td: "text-right" } },
    },
];

onMounted(() => {
    getData();
});

function getRowActions(invite: InviteRow) {
    return [
        { type: "label" as const, label: "Actions" },
        {
            label: "Delete Invite",
            icon: "i-lucide-trash-2",
            async onSelect() {
                await deleteInvite(invite);
            },
        },
    ];
}

async function deleteInvite(invite: InviteRow) {
    await InviteServices.delete(invite.code)
        .then(() => {
            toastNotification.add({
                title: "Invite Deleted",
                description: `Deleted invite for ${invite.email} successfully`,
            });
            getData();
        })
        .catch((err: any) => {
            toastNotification.add({
                title: "Delete failed",
                description: err?.message ?? "Could not delete invite.",
                color: "error",
            });
        });
}

async function getData() {
    try {
        const invites = await InviteServices.getAll();
        data.value = invites.map((invite: Invite) => ({
            code: invite.code,
            email: invite.email,
            role: invite.businessPermissionRole?.name ?? "Admin",
            businessName: invite.business?.name ?? "—",
        }));
    } catch (error) {
        console.error(`Error fetching invites: ${error}`);
    }
}
</script>

<template>
    <div class="h-full flex flex-col">
        <div class="flex flex-row gap-2 mb-3">
            <UInput
                v-model="globalFilter"
                class="max-w-sm"
                placeholder="Search invites..."
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
</template>