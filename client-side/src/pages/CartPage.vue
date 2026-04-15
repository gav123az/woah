<script setup>
    import { ref, computed, onMounted } from "vue";
    import api from "../api.js";
    import { Notyf } from "notyf";
    const notyf = new Notyf();

    const cartItems = ref([]);
    const loading = ref(false);
    const error = ref("");

    const checkoutForm = ref({
        name: "",
        address: ""
    });
    const checkoutLoading = ref(false);
    const checkoutError = ref("");
    const showCheckoutModal = ref(false);

    async function fetchCart() {
        loading.value = true;
        error.value = "";
        try {
const { data } = await api.get("/cart/get-cart");
            cartItems.value = data.cart || data || [];
        } catch {
            error.value = "Failed to fetch cart.";
        } finally {
            loading.value = false;
        }
    }

    function subtotal(item) {
        return Number(item.quantity) * Number(item.product.price);
    }

    const totalPrice = computed(() => {
        return cartItems.value.reduce((sum, item) => sum + subtotal(item), 0);
    });

    async function addToCart(productId, quantity = 1) {
        loading.value = true;
        try {
await api.post("/cart/add-to-cart", { productId, quantity });
            await fetchCart();
            notyf.success("Added to cart!");
        } catch {
            notyf.error("Failed to add to cart.");
        } finally {
            loading.value = false;
        }
    }

    async function updateQuantity(item, newQuantity) {
        if (newQuantity < 1) return;
        loading.value = true;
        try {
await api.patch("/cart/update-cart-quantity", {
    productId: item.product._id,
    newQuantity
});
            await fetchCart();
            notyf.success("Quantity updated.");
        } catch {
            notyf.error("Failed to update quantity.");
        } finally {
            loading.value = false;
        }
    }

    async function removeItem(item) {
        loading.value = true;
        try {
await api.patch(`/cart/${item.product._id}/remove-from-cart`);
            await fetchCart();
            notyf.success("Item removed.");
        } catch {
            notyf.error("Failed to remove item.");
        } finally {
            loading.value = false;
        }
    }

    async function clearCart() {
        loading.value = true;
        try {
await api.put("/cart/clear-cart");
            await fetchCart();
            notyf.success("Cart cleared.");
        } catch {
            notyf.error("Failed to clear cart.");
        } finally {
            loading.value = false;
        }
    }

    function beginCheckout() {
        showCheckoutModal.value = true;
        checkoutForm.value = { name: "", address: "" };
        checkoutError.value = "";
    }

    async function handleCheckout() {
        if (!checkoutForm.value.name || !checkoutForm.value.address) {
            checkoutError.value = "Please enter your name and address.";
            return;
        }
        checkoutLoading.value = true;
        try {
            await api.post("/orders/checkout", {
                clientName: checkoutForm.value.name,
                address: checkoutForm.value.address
            });
            showCheckoutModal.value = false;
            checkoutForm.value = { name: "", address: "" };
            notyf.success("Order placed successfully!");
            await fetchCart();
        } catch (err) {
            checkoutError.value =
                err?.response?.data?.message || "Failed to checkout.";
        } finally {
            checkoutLoading.value = false;
        }
    }

    onMounted(() => {
        fetchCart();
    });
</script>

<template>
    <div class="container py-5" style="max-width:900px;">
        <h1 class="mb-4 fw-bold" style="color: #1976d2;">My Cart</h1>
        <div v-if="loading" class="alert alert-info">Loading...</div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="!cartItems.length && !loading" class="alert alert-warning">
            Cart is empty.
        </div>
        <table v-if="cartItems.length" class="table table-bordered align-middle">
            <thead class="table-light">
                <tr>
                    <th>Product</th>
                    <th>Unit Price</th>
                    <th style="width:150px;">Quantity</th>
                    <th>Subtotal</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in cartItems" :key="item.product._id">
                    <td>
                        {{ item.product.name }}
                    </td>
                    <td>{{ item.product.price }}</td>
                    <td>
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-secondary"
                                @click="updateQuantity(item, item.quantity - 1)">-</button>
                            <input type="number" class="form-control text-center" min="1"
                                :value="item.quantity"
                                @change="e => updateQuantity(item, Number(e.target.value))" />
                            <button class="btn btn-outline-secondary"
                                @click="updateQuantity(item, item.quantity + 1)">+</button>
                        </div>
                    </td>
                    <td>
                        {{ subtotal(item).toLocaleString(undefined, { maximumFractionDigits: 2 }) }}
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm" @click="removeItem(item)">
                            Remove
                        </button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="3" class="text-end">Total</th>
                    <th>
                        {{ totalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 }) }}
                    </th>
                    <th>
                        <button class="btn btn-warning btn-sm" @click="clearCart">
                            Clear Cart
                        </button>
                    </th>
                </tr>
            </tfoot>
        </table>
        <div class="mt-3 d-flex justify-content-end" v-if="cartItems.length">
            <button class="btn btn-primary px-4" @click="beginCheckout">
                Checkout
            </button>
        </div>
        <div v-if="showCheckoutModal">
            <div class="modal-backdrop fade show"></div>
            <div class="modal d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Checkout Order</h5>
                            <button type="button" class="btn-close" @click="showCheckoutModal = false"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="handleCheckout">
                                <div class="mb-3">
                                    <label class="form-label">Name</label>
                                    <input v-model="checkoutForm.name" required class="form-control"
                                        placeholder="Your Name" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Address</label>
                                    <input v-model="checkoutForm.address" required class="form-control"
                                        placeholder="Delivery Address" />
                                </div>
                                <button :disabled="checkoutLoading" type="submit" class="btn btn-success w-100">
                                    {{ checkoutLoading ? "Placing Order..." : "Place Order" }}
                                </button>
                                <div v-if="checkoutError" class="alert alert-danger mt-2">
                                    {{ checkoutError }}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
