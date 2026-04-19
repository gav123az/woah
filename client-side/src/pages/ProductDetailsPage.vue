<script setup>
    import { ref, onMounted } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import { Notyf } from "notyf";
    import api from "../api";
    import { useGlobalStore } from "../stores/global";
    import ProductDetailsComponent from "../components/ProductDetailsComponent.vue";

    const router = useRouter();
    const route = useRoute();
    const notyf = new Notyf();
    const productId = route.params.productId;
    const globalStore = useGlobalStore();

    const product = ref({});
    const loading = ref(true);
    const error = ref("");
    const quantity = ref(1);

    const goBack = () => router.push("/products");

    onMounted(async () => {
        if (globalStore.user?.isAdmin) {
            router.push({ name: "Admin" });
            return;
        }
        try {
            const response = await api.get(`/products/${productId}`);
            product.value = response.data.product || response.data;
        } catch (err) {
            error.value =
                err?.response?.data?.message || "Failed to fetch product.";
        } finally {
            loading.value = false;
        }
    });


    const addToCart = async () => {
        // Check if user is logged in
        if (!globalStore.user?.token) {
            notyf.error("Please log in to add to cart");
            router.push("/login");
            return;
        }

        // Verify token exists in localStorage
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            notyf.error("Session expired. Please log in again");
            router.push("/login");
            return;
        }

        try {
            const response = await api.post("/cart/add-to-cart", {
                productId,
                quantity: quantity.value,
            });
            notyf.success("Added to cart!");
            router.push("/cart");
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || "Failed to add to cart";
            notyf.error(errorMsg);
            
            // If 403 Forbidden, redirect to login
            if (err?.response?.status === 403) {
                router.push("/login");
            }
        }
    };

    const showCheckoutModal = ref(false);
    const checkoutForm = ref({
        name: "",
        address: ""
    });
    const checkoutLoading = ref(false);
    const checkoutError = ref("");

    const buyNow = () => {
        if (!globalStore.user || !globalStore.user.token) {
            notyf.error("Please log in to buy.");
            router.push("/login");
            return;
        }
        showCheckoutModal.value = true;
        checkoutForm.value = { name: "", address: "" };
        checkoutError.value = "";
    };

    const onCheckoutSubmit = async (submitted) => {
        if (!submitted.name || !submitted.address) {
            checkoutError.value = "Please enter your name and address.";
            return;
        }
        checkoutLoading.value = true;
        checkoutError.value = "";
        try {
            await api.post("/cart/add-to-cart", {
                productId,
                quantity: quantity.value,
            });
            await api.post("/orders/checkout");
            showCheckoutModal.value = false;
            checkoutForm.value = { name: "", address: "" };
            notyf.success("Order placed successfully!");
            router.push("/orders");
        } catch (err) {
            checkoutError.value = err?.response?.data?.message || "Failed to checkout.";
        } finally {
            checkoutLoading.value = false;
        }
    };
</script>


<template>
    <ProductDetailsComponent
        :product="product"
        :loading="loading"
        :error="error"
        :quantity="quantity"
        :showCheckoutModal="showCheckoutModal"
        :checkoutForm="checkoutForm"
        :checkoutLoading="checkoutLoading"
        :checkoutError="checkoutError"
        @update:quantity="val => quantity = val"
        @add-to-cart="addToCart"
        @buy-now="buyNow"
        @modal-close="showCheckoutModal = false"
        @checkout-submit="onCheckoutSubmit"
        @go-back="goBack"
    />
</template>