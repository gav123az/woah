<script setup>
    import { ref, onMounted } from "vue";
    import api from "../api.js";
    import { useGlobalStore } from "../stores/global.js";

    const store = useGlobalStore();
    const orders = ref([]);
    const isLoading = ref(false);

    async function fetchOrders() {
        isLoading.value = true;
        try {
            let res;
            if (store.user.isAdmin) {
                res = await api.get("/orders"); 
            } else {
                res = await api.get("/orders/mine"); 
            }
            orders.value = res.data;
        } catch (e) {
            orders.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    onMounted(() => {
        fetchOrders();
    });
</script>

<template>
    <div class="container my-5">
        <h1>Orders</h1>
        <p v-if="store.user.isAdmin">
            All orders 
        </p>
        <p v-else>
            My orders
        </p>
        <div v-if="isLoading" class="mb-3">Loading orders...</div>
        <table v-if="orders.length && store.user.isAdmin" class="table table-hover mt-4">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Order Id</th>
                    <th>Items</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order._id">
                    <td>{{ order.user?.name || order.userId }}</td>
                    <td>{{ order._id }}</td>
                    <td>
                        <ul class="mb-0">
                            <li v-for="item in order.items" :key="item.productId">
                                {{ item.productName || item.productId }} x{{ item.quantity }}
                            </li>
                        </ul>
                    </td>
                    <td>{{ order.status }}</td>
                </tr>
            </tbody>
        </table>
        
        <table v-if="orders.length && !store.user.isAdmin" class="table table-hover mt-4">
            <thead>
                <tr>
                    <th>Order Id</th>
                    <th>Items</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order._id">
                    <td>{{ order._id }}</td>
                    <td>
                        <ul class="mb-0">
                            <li v-for="item in order.items" :key="item.productId">
                                {{ item.productName || item.productId }} x{{ item.quantity }}
                            </li>
                        </ul>
                    </td>
                    <td>{{ order.status }}</td>
                </tr>
            </tbody>
        </table>
        <div v-if="!orders.length && !isLoading" class="text-muted mt-4">
            No orders found.
        </div>
    </div>
</template>


<style scoped>
.container {
    max-width: 800px;
}
</style>
