<script setup>
import { ref, computed, onMounted, watch } from "vue";
import api from "../api.js";
import { Notyf } from "notyf";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global.js";
import CheckoutModal from "../components/CheckoutModal.vue";
const notyf = new Notyf();
const router = useRouter();

const cartItems = ref([]);
const loading = ref(false);
const error = ref("");

const showClearCartModal = ref(false);
const globalStore = useGlobalStore();

function openClearCartModal() {
    showClearCartModal.value = true;
}
function closeClearCartModal() {
    showClearCartModal.value = false;
}

async function handleConfirmClearCart() {
    loading.value = true;
    try {
        await api.put("/cart/clear-cart");
        await fetchCart();
        notyf.success("Cart cleared.");
    } catch {
        notyf.error("Failed to clear cart.");
    } finally {
        loading.value = false;
        showClearCartModal.value = false;
    }
}

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
        cartItems.value = data.cart?.cartItems || [];
    } catch {
        error.value = "Failed to fetch cart.";
    } finally {
        loading.value = false;
    }
}

function subtotal(item) {
    if (!item.productId || typeof item.productId.price === "undefined") return 0;
    return Number(item.quantity) * Number(item.productId.price);
}

const cartItemsWithProduct = computed(() =>
    cartItems.value.filter(item => item && item.productId)
);

const totalPrice = computed(() => {
    return cartItemsWithProduct.value.reduce((sum, item) => sum + subtotal(item), 0);
});

async function updateQuantity(item, newQuantity) {
    if (newQuantity < 1) return;
    if (item.productId && typeof item.productId.stock === "number" && newQuantity > item.productId.stock) return;
    loading.value = true;
    try {
        await api.patch("/cart/update-cart-quantity", {
            productId: item.productId._id,
            newQuantity
        });
        await fetchCart();
    } catch {
        notyf.error("Failed to update quantity.");
    } finally {
        loading.value = false;
    }
}

async function removeItem(item) {
    loading.value = true;
    try {
        await api.patch(`/cart/${item.productId._id}/remove-from-cart`);
        await fetchCart();
        notyf.success("Item removed.");
    } catch {
        notyf.error("Failed to remove item.");
    } finally {
        loading.value = false;
    }
}

function beginCheckout() {
    showCheckoutModal.value = true;
    checkoutForm.value = { name: "", address: "" };
    checkoutError.value = "";
}

async function onCheckoutSubmit(submitted) {
    if (!submitted.name || !submitted.address) {
        checkoutError.value = "Please enter your name and address.";
        return;
    }
    checkoutLoading.value = true;
    checkoutError.value = "";
    try {
        await api.post("/orders/checkout");
        showCheckoutModal.value = false;
        checkoutForm.value = { name: "", address: "" };
        notyf.success("Order placed successfully!");
        await fetchCart();
        router.push("/");
    } catch (err) {
        checkoutError.value =
            err?.response?.data?.message || "Failed to checkout.";
    } finally {
        checkoutLoading.value = false;
    }
}

onMounted(() => {
    if (!globalStore.user.isAdmin) {
        fetchCart();
    }
});
watch(() => globalStore.user.isAdmin, (isAdmin) => {
    if (isAdmin) {
        router.replace("/");
    }
});
</script>

<template>
    <div v-if="!globalStore.user.isAdmin">
        <div v-if="showClearCartModal" class="clearcart-container">
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Clear Cart</h5>
                    </div>
                    <div class="modal-body">
                        <p class="clearcart-message">Are you sure you want to clear your cart?</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel" @click="closeClearCartModal">No, Keep Items</button>
                        <button class="btn-confirm" @click="handleConfirmClearCart">Clear Cart</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="cart-page">
            <div class="cart-container">
                <div class="page-header">
                    <h1 class="page-title">Shopping Cart</h1>
                    <p class="page-subtitle">Review and manage your items</p>
                </div>

                <div v-if="error" class="alert alert-error">
                    <i class="bi bi-exclamation-triangle"></i>
                    {{ error }}
                </div>

                <div v-if="!cartItems.length && !loading" class="empty-state">
                    <div class="empty-icon">
                        <i class="bi bi-bag"></i>
                    </div>
                    <h3>Your cart is empty</h3>
                    <p>Add some items to get started shopping!</p>
                    <router-link to="/products" class="btn-explore">Continue Shopping</router-link>
                </div>

                <div v-if="cartItems.length" class="cart-content">
                    <div class="cart-items">
                        <div v-for="item in cartItemsWithProduct" :key="item.productId._id" class="cart-item-card">
                            <div class="item-image">
                                <div class="image-placeholder">
                                    <i class="bi bi-image"></i>
                                </div>
                            </div>
                            <div class="item-details">
                                <h3 class="item-name">{{ item.productId.name }}</h3>
                                <p class="item-price">${{ item.productId.price.toFixed(2) }}</p>
                            </div>
                            <div class="item-quantity">
                                <button class="qty-btn" @click="updateQuantity(item, item.quantity - 1)" :disabled="item.quantity <= 1">−</button>
                                <span class="qty-value">{{ item.quantity }}</span>
                                <button class="qty-btn" @click="updateQuantity(item, item.quantity + 1)" :disabled="item.quantity >= item.productId.stock">+</button>
                            </div>
                            <div class="item-subtotal">
                                <span class="subtotal-label">Subtotal</span>
                                <span class="subtotal-value">${{ subtotal(item).toFixed(2) }}</span>
                            </div>
                            <button class="btn-remove" @click="removeItem(item)" title="Remove item">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </div>
                    </div>

                    <div class="cart-summary">
                        <div class="summary-header">
                            <h2>Order Summary</h2>
                        </div>
                        <div class="summary-content">
                            <div class="summary-row">
                                <span>Items ({{ cartItemsWithProduct.length }})</span>
                                <span>${{ totalPrice.toFixed(2) }}</span>
                            </div>
                            <div class="summary-row">
                                <span>Shipping</span>
                                <span class="free">Free</span>
                            </div>
                            <div class="summary-divider"></div>
                            <div class="summary-total">
                                <span>Total</span>
                                <span>${{ totalPrice.toFixed(2) }}</span>
                            </div>
                        </div>
                        <button class="btn-checkout" @click="beginCheckout">
                            Proceed to Checkout
                            <i class="bi bi-arrow-right"></i>
                        </button>
                        <button class="btn-clear" @click="openClearCartModal">Clear Cart</button>
                    </div>
                </div>
            </div>

            <CheckoutModal
                :visible="showCheckoutModal"
                :form="checkoutForm"
                :loading="checkoutLoading"
                :error="checkoutError"
                @close="showCheckoutModal = false"
                @submit="onCheckoutSubmit"
            />
        </div>
    </div>
</template>

<style scoped>
/* Page Container */
.cart-page {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary-bg) 0%, #faf1e8 100%);
    padding: 60px 20px;
}

.cart-container {
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

/* Alerts */
.alert {
    padding: 16px 20px;
    border-radius: 12px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.alert-error {
    background: rgba(214, 69, 69, 0.1);
    border: 1px solid rgba(214, 69, 69, 0.3);
    color: var(--primary-color);
}

.alert i {
    font-size: 20px;
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

/* Cart Content */
.cart-content {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 30px;
}

/* Cart Items */
.cart-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.cart-item-card {
    display: grid;
    grid-template-columns: 100px 1fr 120px 120px 50px;
    gap: 16px;
    align-items: center;
    padding: 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.cart-item-card:hover {
    box-shadow: 0 8px 32px rgba(214, 69, 69, 0.12);
    transform: translateY(-2px);
}

.item-image {
    width: 100px;
    height: 100px;
}

.image-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f5e4d9, #faf1e8);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    opacity: 0.3;
    font-size: 40px;
}

.item-details {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.item-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0;
}

.item-price {
    font-size: 14px;
    color: var(--primary-color);
    font-weight: 600;
    margin: 0;
}

.item-quantity {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 12px;
    background: linear-gradient(135deg, #f9f9f9, white);
    border-radius: 10px;
    border: 1px solid var(--border-color);
}

.qty-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: var(--text-dark);
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 6px;
}

.qty-btn:hover:not(:disabled) {
    background: var(--primary-color);
    color: white;
}

.qty-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.qty-value {
    font-weight: 700;
    color: var(--text-dark);
    min-width: 30px;
    text-align: center;
}

.item-subtotal {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}

.subtotal-label {
    font-size: 12px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.subtotal-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-color);
}

.btn-remove {
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(214, 69, 69, 0.1);
    color: var(--primary-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.btn-remove:hover {
    background: rgba(214, 69, 69, 0.2);
    transform: scale(1.05);
}

/* Cart Summary */
.cart-summary {
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    position: sticky;
    top: 100px;
    height: fit-content;
}

.summary-header {
    background: linear-gradient(135deg, var(--primary-color), #ff6b6b);
    color: white;
    padding: 24px;
}

.summary-header h2 {
    font-size: 20px;
    margin: 0;
    font-weight: 700;
}

.summary-content {
    padding: 24px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    color: var(--text-secondary);
    font-size: 14px;
}

.summary-row .free {
    color: #2d7a3a;
    font-weight: 600;
}

.summary-divider {
    height: 1px;
    background: var(--border-color);
    margin: 16px 0;
}

.summary-total {
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
    font-size: 18px;
    font-weight: 700;
    color: var(--text-dark);
}

.summary-total span:last-child {
    color: var(--primary-color);
}

.btn-checkout {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 16px 24px;
    margin-top: 20px;
    background: linear-gradient(135deg, var(--primary-color), #ff6b6b);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(214, 69, 69, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn-checkout:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(214, 69, 69, 0.4);
}

.btn-clear {
    width: 100%;
    padding: 12px 24px;
    margin-top: 12px;
    background: white;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-clear:hover {
    background: rgba(214, 69, 69, 0.05);
}

/* Modal Styles */
.clearcart-container {
    min-height: 100vh;
    background: rgba(26, 26, 26, 0.3);
    backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(26, 26, 26, 0.3);
    backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.modal-content {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 420px;
    overflow: hidden;
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
    from {
        transform: translateY(40px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-header {
    background: linear-gradient(135deg, var(--primary-bg) 0%, rgba(245, 228, 217, 0.8) 100%);
    border-bottom: 2px solid var(--primary-color);
    padding: 28px 30px;
    text-align: center;
}

.modal-title {
    color: var(--primary-color);
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    letter-spacing: 0.5px;
}

.modal-body {
    padding: 40px;
    text-align: center;
}

.clearcart-message {
    color: var(--text-secondary);
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
    font-weight: 500;
}

.modal-footer {
    display: flex;
    gap: 12px;
    padding: 20px 40px 40px;
    justify-content: center;
}

.btn-cancel,
.btn-confirm {
    padding: 12px 28px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    letter-spacing: 0.3px;
    text-transform: uppercase;
    min-width: 120px;
}

.btn-cancel {
    background: #e0e0e0;
    color: var(--text-dark);
    border: 2px solid #d0d0d0;
}

.btn-cancel:hover {
    background: #d0d0d0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-confirm {
    background: linear-gradient(135deg, var(--primary-color) 0%, #c23636 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(214, 69, 69, 0.2);
}

.btn-confirm:hover {
    background: linear-gradient(135deg, #c23636 0%, #a82d2d 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(214, 69, 69, 0.3);
}

.btn-confirm:active {
    transform: translateY(0);
}

/* Responsive Cart */
@media (max-width: 1024px) {
    .cart-content {
        grid-template-columns: 1fr;
    }

    .cart-summary {
        position: static;
    }
}

@media (max-width: 768px) {
    .page-title {
        font-size: 28px;
    }

    .cart-item-card {
        grid-template-columns: 80px 1fr;
        gap: 12px;
    }

    .item-quantity,
    .item-subtotal,
    .btn-remove {
        grid-column: 2;
        justify-self: start;
    }
}

@media (max-width: 480px) {
    .cart-page {
        padding: 40px 16px;
    }

    .cart-item-card {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .item-image {
        width: 100%;
    }

    .item-quantity,
    .item-subtotal,
    .btn-remove {
        grid-column: auto;
        width: 100%;
    }
}
</style>