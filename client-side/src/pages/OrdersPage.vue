<script setup>
    import { ref, watch } from "vue";
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
                res = await api.get("/orders/all-orders");
                orders.value = res.data.orders || res.data;
            } else {
                res = await api.get("/orders/my-orders");
                orders.value = res.data.orders || res.data;
            }
        } catch (e) {
            orders.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    watch(
        () => [store.user.isAdmin, store.user.isLoading],
        ([isAdmin, isLoading]) => {
            if (isAdmin !== null && !isLoading) {
                fetchOrders();
            }
        },
        { immediate: true }
    );
</script>

<template>
    <div class="orders-page">
        <div class="orders-container">
            <div class="page-header">
                <h1 class="page-title">{{ store.user.isAdmin ? 'All Orders' : 'My Orders' }}</h1>
                <p class="page-subtitle">{{ store.user.isAdmin ? 'Manage customer orders' : 'Track your purchases' }}</p>
            </div>

            <div v-if="isLoading" class="loading-state">
                <div class="spinner"></div>
                <p>Loading orders...</p>
            </div>

            <div v-else-if="!orders.length" class="empty-state">
                <div class="empty-icon">
                    <i class="bi bi-inbox"></i>
                </div>
                <h3>No orders yet</h3>
                <p>{{ store.user.isAdmin ? 'Orders will appear here' : 'Start shopping to place your first order!' }}</p>
                <router-link v-if="!store.user.isAdmin" to="/products" class="btn-explore">
                    Continue Shopping
                </router-link>
            </div>

            <div v-else class="orders-grid">
                <!-- Admin View -->
                <div v-if="store.user.isAdmin" class="orders-list">
                    <div v-for="order in orders" :key="order._id" class="order-card">
                        <div class="order-header">
                            <div class="order-info">
                                <h3 class="order-id">Order {{ order._id.slice(-8).toUpperCase() }}</h3>
                                <p class="order-user">Customer: <span>{{ order.userName || order.userId }}</span></p>
                            </div>
                            <div class="status-badge" :class="`status-${order.status.toLowerCase()}`">
                                {{ order.status }}
                            </div>
                        </div>

                        <div class="order-items">
                            <h4 class="items-title">Items</h4>
                            <ul class="items-list">
                                <li v-for="item in order.productsOrdered" :key="item.productId" class="item">
                                    <span class="item-name">{{ item.name || 'Product ' + item.productId }}</span>
                                    <span class="item-qty">x{{ item.quantity }}</span>
                                    <span class="item-price">${{ item.subtotal.toFixed(2) }}</span>
                                </li>
                            </ul>
                        </div>

                        <div class="order-footer">
                            <span class="date">{{ new Date(order.orderedOn).toLocaleDateString() }}</span>
                            <span class="total">${{ order.totalPrice.toFixed(2) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Customer View -->
                <div v-else class="orders-list">
                    <div v-for="order in orders" :key="order._id" class="order-card">
                        <div class="order-header">
                            <div class="order-info">
                                <h3 class="order-id">Order {{ order._id.slice(-8).toUpperCase() }}</h3>
                                <p class="order-date">{{ new Date(order.orderedOn).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
                            </div>
                            <div class="status-badge" :class="`status-${order.status.toLowerCase()}`">
                                {{ order.status }}
                            </div>
                        </div>

                        <div class="order-items">
                            <h4 class="items-title">Items Ordered</h4>
                            <ul class="items-list">
                                <li v-for="item in order.productsOrdered" :key="item.productId" class="item">
                                    <span class="item-name">{{ item.name || 'Product' }}</span>
                                    <span class="item-qty">x{{ item.quantity }}</span>
                                    <span class="item-price">${{ item.subtotal.toFixed(2) }}</span>
                                </li>
                            </ul>
                        </div>

                        <div class="order-footer">
                            <div class="order-summary">
                                <span class="summary-label">Total Amount:</span>
                                <span class="summary-value">${{ order.totalPrice.toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Page Container */
.orders-page {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary-bg) 0%, #faf1e8 100%);
    padding: 60px 20px;
}

.orders-container {
    max-width: 1200px;
    margin: 0 auto;
}

/* Page Header */
.page-header {
    margin-bottom: 50px;
    text-align: center;
}

.page-title {
    font-size: 42px;
    font-weight: 800;
    color: var(--text-dark);
    margin: 0 0 8px 0;
    letter-spacing: -1px;
}

.page-subtitle {
    font-size: 16px;
    color: var(--text-secondary);
    margin: 0;
}

/* Loading State */
.loading-state {
    text-align: center;
    padding: 60px 20px;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(214, 69, 69, 0.1);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-state p {
    color: var(--text-secondary);
    font-size: 16px;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.empty-icon {
    font-size: 80px;
    color: var(--primary-color);
    opacity: 0.2;
    margin-bottom: 20px;
}

.empty-state h3 {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 8px;
}

.empty-state p {
    font-size: 16px;
    color: var(--text-secondary);
    margin-bottom: 30px;
}

.btn-explore {
    display: inline-block;
    padding: 14px 32px;
    background: linear-gradient(135deg, var(--primary-color), #ff6b6b);
    color: white;
    text-decoration: none;
    border-radius: 12px;
    font-weight: 700;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(214, 69, 69, 0.3);
}

.btn-explore:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(214, 69, 69, 0.4);
}

/* Orders Grid */
.orders-grid {
    display: grid;
}

.orders-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 24px;
}

/* Order Card */
.order-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
}

.order-card:hover {
    box-shadow: 0 12px 40px rgba(214, 69, 69, 0.12);
    transform: translateY(-4px);
}

/* Order Header */
.order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px;
    background: linear-gradient(135deg, rgba(245, 228, 217, 0.8), white);
    border-bottom: 1px solid var(--border-color);
}

.order-info {
    flex: 1;
}

.order-id {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0 0 4px 0;
    letter-spacing: 0.5px;
}

.order-date {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0;
}

.order-user {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 6px 0 0 0;
}

.order-user span {
    font-weight: 600;
    color: var(--text-dark);
}

/* Status Badge */
.status-badge {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 100px;
    text-align: center;
    transition: all 0.3s ease;
}

.status-pending {
    background: rgba(255, 152, 0, 0.15);
    color: #ff9800;
    border: 1px solid rgba(255, 152, 0, 0.3);
}

.status-completed {
    background: rgba(76, 175, 80, 0.15);
    color: #4caf50;
    border: 1px solid rgba(76, 175, 80, 0.3);
}

.status-cancelled {
    background: rgba(214, 69, 69, 0.15);
    color: var(--primary-color);
    border: 1px solid rgba(214, 69, 69, 0.3);
}

/* Order Items */
.order-items {
    padding: 24px;
}

.items-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 16px 0;
}

.items-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: var(--light-gray);
    border-radius: 8px;
    font-size: 14px;
}

.item-name {
    flex: 1;
    color: var(--text-dark);
    font-weight: 600;
}

.item-qty {
    color: var(--text-secondary);
    margin: 0 8px;
    font-size: 13px;
}

.item-price {
    color: var(--primary-color);
    font-weight: 700;
    min-width: 70px;
    text-align: right;
}

/* Order Footer */
.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: var(--light-gray);
    border-top: 1px solid var(--border-color);
}

.date {
    font-size: 12px;
    color: var(--text-secondary);
}

.total {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-color);
}

.order-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.summary-label {
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.summary-value {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-color);
}

/* Responsive */
@media (max-width: 1024px) {
    .orders-list {
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    }
}

@media (max-width: 768px) {
    .page-title {
        font-size: 32px;
    }

    .orders-list {
        grid-template-columns: 1fr;
    }

    .order-header {
        flex-direction: column;
        gap: 12px;
    }

    .status-badge {
        align-self: flex-start;
    }

    .order-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .total {
        font-size: 18px;
    }
}

@media (max-width: 480px) {
    .orders-page {
        padding: 40px 16px;
    }

    .page-header {
        margin-bottom: 30px;
    }

    .page-title {
        font-size: 24px;
    }

    .item {
        flex-wrap: wrap;
        gap: 8px;
    }

    .item-price {
        width: 100%;
        text-align: left;
    }
}
</style>