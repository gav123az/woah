<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global';
    import { storeToRefs } from 'pinia';
    import api from '../api';
    import ProductCard from '../components/ProductCard.vue';
    import ProductSearchBar from '../components/ProductSearchBar.vue';

    const router = useRouter();
    const store = useGlobalStore();
    const { user } = storeToRefs(store);

    const products = ref([]);
    const loading = ref(true);
    const searchText = ref('');

    onMounted(async () => {
        if (user.value.isAdmin) {
            router.push({ name: 'Admin' });
            return;
        }
        try {
            const resp = await api.get('/products/active');
            const arr = resp.data.products || resp.data || [];
            products.value = arr; 
        } catch {
            products.value = [];
        } finally {
            loading.value = false;
        }
    });

    const filteredProducts = computed(() => {
        const term = searchText.value.trim().toLowerCase();
        if (!term) return products.value;
        return products.value.filter(p =>
            (p.name || p.title || '').toLowerCase().includes(term) ||
            (p.description || '').toLowerCase().includes(term)
        );
    });
</script>

<template>
    <div class="container py-4">
        <div class="row mb-4">
            <div class="col text-center">
                <h1 class="foods-title mb-3">Japanese Foods</h1>
                <p class="lead mb-0">Browse and search for our delicious Japanese dishes</p>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-12 col-md-8 mx-auto">
                <ProductSearchBar v-model="searchText" class="mb-2" />
            </div>
        </div>

        <div v-if="loading" class="row">
            <div class="col text-center text-muted py-5">
                <div class="spinner-border mb-2" style="color: #d64545;" role="status"></div>
                <div>Loading Japanese foods...</div>
            </div>
        </div>
        <div v-else>
            <div v-if="products.length !== 0" class="row justify-content-center mt-4">
                <div
                    v-for="product in filteredProducts"
                    :key="product._id || product.id"
                    class="col-12 col-sm-6 col-md-4 d-flex mb-4"
                >
                    <ProductCard :product="product" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.foods-title {
    color: #d64545;
    font-size: 36px;
    font-weight: 700;
}

.lead {
    color: #666;
    font-size: 16px;
}
</style>
