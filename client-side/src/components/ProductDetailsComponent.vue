<script setup>
    import { ref } from "vue";
    import CheckoutModal from "./CheckoutModal.vue";

    const props = defineProps({
        product: Object,
        loading: Boolean,
        error: String,
        quantity: Number,
        showCheckoutModal: Boolean,
        checkoutForm: Object,
        checkoutLoading: Boolean,
        checkoutError: String,
    });
    const emits = defineEmits([
        "update:quantity",
        "add-to-cart",
        "buy-now",
        "update:checkoutForm",
        "modal-close",
        "checkout-submit",
        "go-back"
    ]);

    function increment() {
        if (props.quantity < (props.product?.stock || 1)) {
            emits("update:quantity", props.quantity + 1);
        }
    }
    function decrement() {
        if (props.quantity > 1) {
            emits("update:quantity", props.quantity - 1);
        }
    }

    function addToCart() {
        emits("add-to-cart");
    }
    function buyNow() {
        emits("buy-now");
    }
    function onModalClose() {
        emits("modal-close");
    }
    function onCheckoutSubmit(val) {
        emits("checkout-submit", val);
    }
    function goBack() {
        emits("go-back");
    }
</script>


<template>
    <div class="product-details-container">
        <div v-if="loading" class="fs-center muted">Loading item...</div>
        <div v-else-if="error" class="fs-center error">{{ error }}</div>

        <div v-else class="details-layout">
            <!-- Left: Product Image -->
            <div class="image-section">
                <div class="image-card">
                    <template v-if="product.url">
                        <img
                            :src="product.url"
                            alt="Product photo"
                            class="product-image"
                        />
                    </template>
                    <template v-else>
                        <i class="bi bi-egg-fried"></i>
                    </template>
                </div>
            </div>

            <!-- Right: Product Details -->
            <div class="details-section">
                <!-- Back Button -->
                <button
                    class="back-link"
                    @click="goBack"
                    aria-label="Back to Products"
                >
                    <i class="bi bi-arrow-left"></i>
                    Back to catalog
                </button>

                <!-- Product Title -->
                <h1 class="product-title">{{ product.name }}</h1>

                <!-- Status -->
                <span
                    class="product-status"
                    :class="product.isActive && product.stock > 0 ? 'active' : 'inactive'"
                >
                    {{
                        product.isActive && product.stock > 0
                            ? 'Available'
                            : (product.isActive && product.stock === 0
                                ? 'Not available'
                                : 'Unavailable')
                    }}
                </span>

                <!-- Description -->
                <p class="product-description">
                    {{ product.description }}
                </p>

                <!-- Price and Stock -->
                <div class="info-box">
                    <div class="info-row">
                        <span class="info-label">Price</span>
                        <span class="info-value price">${{ product.price }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Stock</span>
                        <span
                            class="info-value"
                            :class="product.stock > 0 ? 'in-stock' : 'out-stock'"
                        >
                            {{ product.stock > 0 ? product.stock + ' available' : 'Sold out' }}
                        </span>
                    </div>
                </div>

                <!-- Quantity and Actions -->
                <div v-if="product.isActive && product.stock > 0" class="action-section">
                    <div class="quantity-control">
                        <button class="qty-btn" @click="decrement" :disabled="quantity <= 1">−</button>
                        <span class="qty-value">{{ quantity }}</span>
                        <button class="qty-btn" @click="increment" :disabled="quantity >= product.stock">+</button>
                    </div>
                    <div class="buttons-group">
                        <button class="add-to-cart-btn" @click="addToCart">Add to Cart</button>
                        <button class="buy-now-btn" @click="buyNow">Buy Now</button>
                    </div>
                </div>
                <div v-else class="unavailable-message">
                    <p>This product is currently unavailable</p>
                </div>
            </div>
        </div>

        <CheckoutModal
            :visible="showCheckoutModal"
            :form="checkoutForm"
            :loading="checkoutLoading"
            :error="checkoutError"
            @close="onModalClose"
            @submit="onCheckoutSubmit"
        />
    </div>
</template>

<style scoped>
/* Main Container */
.product-details-container {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary-bg) 0%, #faf1e8 100%);
    padding: 60px 20px;
}

.fs-center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    font-size: 18px;
    font-weight: 500;
}

.fs-center.muted {
    color: var(--text-secondary);
}

.fs-center.error {
    color: var(--primary-color);
}

/* Layout */
.details-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    max-width: 1300px;
    margin: 0 auto;
    align-items: center;
}

/* Image Section */
.image-section {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.image-section::before {
    content: '';
    position: absolute;
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(214, 69, 69, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
}

.image-card {
    width: 100%;
    max-width: 450px;
    aspect-ratio: 1;
    background: white;
    border-radius: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
    padding: 20px;
    position: relative;
    z-index: 1;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 30px 80px rgba(214, 69, 69, 0.15);
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
}

.image-card i {
    font-size: 120px;
    color: var(--primary-color);
    opacity: 0.15;
}

/* Details Section */
.details-section {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

/* Back Link */
.back-link {
    align-self: flex-start;
    background: rgba(214, 69, 69, 0.08);
    border: none;
    color: var(--primary-color);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    padding: 10px 16px;
    border-radius: 8px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-bottom: 8px;
}

.back-link:hover {
    background: rgba(214, 69, 69, 0.15);
    transform: translateX(-4px);
}

.back-link i {
    font-size: 16px;
}

/* Product Title */
.product-title {
    font-size: 42px;
    font-weight: 800;
    color: var(--text-dark);
    line-height: 1.1;
    margin: 0;
    letter-spacing: -1px;
}

/* Product Status */
.product-status {
    display: inline-flex;
    align-items: center;
    padding: 10px 18px;
    border-radius: 24px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    width: fit-content;
    transition: all 0.3s ease;
}

.product-status.active {
    background: linear-gradient(135deg, rgba(45, 122, 58, 0.1), rgba(100, 200, 100, 0.08));
    color: #2d7a3a;
    border: 1px solid rgba(45, 122, 58, 0.2);
}

.product-status.inactive {
    background: linear-gradient(135deg, rgba(214, 69, 69, 0.1), rgba(214, 69, 69, 0.08));
    color: var(--primary-color);
    border: 1px solid rgba(214, 69, 69, 0.2);
}

/* Product Description */
.product-description {
    font-size: 16px;
    color: var(--text-secondary);
    line-height: 1.7;
    margin: 0;
    text-align: justify;
}

/* Info Box */
.info-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding: 28px;
    background: white;
    border-radius: 16px;
    border: none;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    transition: all 0.4s ease;
}

.info-box:hover {
    box-shadow: 0 12px 48px rgba(214, 69, 69, 0.1);
    transform: translateY(-4px);
}

.info-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-label {
    font-size: 11px;
    font-weight: 700;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.7px;
}

.info-value {
    font-size: 28px;
    font-weight: 800;
    color: var(--text-dark);
}

.info-value.price {
    background: linear-gradient(135deg, var(--primary-color), #ff6b6b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.info-value.in-stock {
    color: #2d7a3a;
}

.info-value.out-stock {
    color: #d64545;
}

/* Action Section */
.action-section {
    display: flex;
    gap: 16px;
    align-items: center;
}

.quantity-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0;
    padding: 12px 8px;
    background: linear-gradient(135deg, #f9f9f9, white);
    border-radius: 12px;
    border: 2px solid var(--border-color);
    transition: all 0.3s ease;
}

.quantity-control:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 16px rgba(214, 69, 69, 0.1);
}

.qty-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    color: var(--text-dark);
    font-size: 18px;
    font-weight: 700;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.qty-btn:hover:not(:disabled) {
    background: var(--primary-color);
    color: white;
    transform: scale(1.1);
}

.qty-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.qty-value {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-dark);
    min-width: 40px;
    text-align: center;
    flex: 1;
}

.add-to-cart-btn {
    flex: 1;
    padding: 16px 32px;
    background: linear-gradient(135deg, var(--primary-color), #ff6b6b);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 10px 30px rgba(214, 69, 69, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
}

.add-to-cart-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transition: left 0.3s ease;
    z-index: 1;
}

.add-to-cart-btn:hover::before {
    left: 100%;
}

.add-to-cart-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(214, 69, 69, 0.4);
}

.add-to-cart-btn:active {
    transform: translateY(-1px);
}

/* Buttons Group */
.buttons-group {
    display: flex;
    gap: 12px;
    flex: 1;
}

.buy-now-btn {
    flex: 1;
    padding: 16px 32px;
    background: white;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
}

.buy-now-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--primary-color), #ff6b6b);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.buy-now-btn:hover {
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(214, 69, 69, 0.3);
}

.buy-now-btn:hover::before {
    transform: scaleX(1);
}

.buy-now-btn:active {
    transform: translateY(-1px);
}

/* Unavailable Message */
.unavailable-message {
    padding: 24px;
    background: rgba(214, 69, 69, 0.1);
    border: 2px solid rgba(214, 69, 69, 0.3);
    border-radius: 12px;
    text-align: center;
}

.unavailable-message p {
    color: var(--primary-color);
    font-weight: 600;
    margin: 0;
    font-size: 16px;
}

/* Responsive */
@media (max-width: 1024px) {
    .details-layout {
        grid-template-columns: 1fr;
        gap: 50px;
    }

    .product-title {
        font-size: 36px;
    }

    .details-layout {
        max-width: 100%;
    }
}

@media (max-width: 768px) {
    .product-details-container {
        padding: 40px 16px;
    }

    .details-layout {
        gap: 40px;
    }

    .product-title {
        font-size: 28px;
    }

    .image-card {
        max-width: 100%;
    }

    .action-section {
        flex-direction: column;
    }

    .quantity-control {
        width: 100%;
    }

    .buttons-group {
        display: flex;
        gap: 12px;
        width: 100%;
    }

    .add-to-cart-btn {
        width: 100%;
    }

    .buy-now-btn {
        width: 100%;
    }

    .info-box {
        grid-template-columns: 1fr;
        padding: 24px;
    }
}

@media (max-width: 480px) {
    .product-title {
        font-size: 24px;
    }

    .product-details-container {
        padding: 30px 12px;
    }

    .details-layout {
        gap: 30px;
    }

    .qty-btn {
        width: 36px;
        height: 36px;
    }

    .add-to-cart-btn {
        padding: 14px 24px;
        font-size: 14px;
    }

    .buy-now-btn {
        padding: 14px 24px;
        font-size: 14px;
    }

    .info-value {
        font-size: 24px;
    }
}
</style>


