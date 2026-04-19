<script setup>
    import { ref, onMounted } from "vue";
    import api from "../api.js";
    import { Notyf } from "notyf";
    const notyf = new Notyf();

    const users = ref([]);
    const userLoading = ref(false);
    const userError = ref("");

    async function fetchUsers() {
        userLoading.value = true;
        userError.value = "";
        try {
            const { data } = await api.get("/users/all");
            users.value = data.users ?? [];
        } catch (err) {
            userError.value = err?.response?.data?.error || "Failed to fetch users.";
        } finally {
            userLoading.value = false;
        }
    }

    async function setUserAsAdmin(userId) {
        try {
            await api.patch(`/users/${userId}/set-as-admin`);
            notyf.success("User promoted to admin!");
            await fetchUsers();
        } catch (err) {
            notyf.error(err?.response?.data?.error || "Failed to update admin status.");
        }
    }

    async function removeUserAsAdmin(userId) {
        try {
            await api.patch(`/users/${userId}/remove-admin`);
            notyf.success("User demoted to regular user!");
            await fetchUsers();
        } catch (err) {
            notyf.error(err?.response?.data?.error || "Failed to remove admin status.");
        }
    }

    onMounted(() => {
        fetchUsers();
    });
</script>

<template>
    <div class="products-table-wrapper">
        <table class="products-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>MOBILE NO</th>
                    <th>TYPE</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user._id" class="product-row">
                    <td>{{ user._id }}</td>
                    <td>{{ user.firstName }} {{ user.lastName }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.mobileNo }}</td>
                    <td>
                        <span class="status-badge" :class="{ 'status-active': user.isAdmin, 'status-inactive': !user.isAdmin }">
                            {{ user.isAdmin ? 'Admin' : 'Regular' }}
                        </span>
                    </td>
                    <td class="actions-cell">
                        <button
                            v-if="!user.isAdmin"
                            class="btn-action btn-activate"
                            @click="setUserAsAdmin(user._id)"
                        >
                            Set as Admin
                        </button>
                        <button
                            v-else
                            class="btn-action btn-deactivate"
                            @click="removeUserAsAdmin(user._id)"
                        >
                            Remove Admin
                        </button>
                    </td>
                </tr>
                <tr v-if="!users.length">
                    <td colspan="6" class="no-products">No users found.</td>
                </tr>
            </tbody>
        </table>
        <div v-if="userLoading" style="padding:18px 0 9px 28px;color:#999;font-style:italic">Loading users...</div>
        <div v-if="userError" style="padding:12px 0 18px 28px;color:#d8000c;font-weight:500">{{ userError }}</div>
    </div>
</template>

<style scoped>
    .products-table-wrapper {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 40px;
        margin-bottom: 46px;
    }

    .products-table {
        width: 100%;
        border-collapse: collapse;
        margin: 0;
    }

    .products-table thead {
        background: var(--primary-bg);
        border-bottom: 2px solid var(--primary-color);
    }

    .products-table th {
        color: var(--primary-color);
        font-weight: 700;
        padding: 16px;
        text-align: left;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: var(--primary-bg);
    }

    .product-row {
        border-bottom: 1px solid #e0e0e0;
        transition: background-color 0.2s ease;
    }

    .product-row:hover {
        background-color: rgba(245, 228, 217, 0.5);
    }

    .products-table td {
        padding: 16px;
        color: var(--text-secondary);
        font-size: 14px;
    }

    .status-badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: capitalize;
    }

    .status-active {
        background: #d4edda;
        color: #155724;
    }

    .status-inactive {
        background: #f8d7da;
        color: #721c24;
    }

    .actions-cell {
        display: flex;
        gap: 8px;
    }

    .btn-action {
        padding: 6px 12px;
        border: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .btn-activate {
        background: #28a745;
        color: white;
    }

    .btn-activate:hover {
        background: #218838;
    }

    .btn-deactivate {
        background: #ffc107;
        color: #000;
    }

    .btn-deactivate:hover {
        background: #e0a800;
    }

    .no-products {
        text-align: center;
        color: #999;
        font-style: italic;
    }
</style>