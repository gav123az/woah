<script setup>
    import { ref, onMounted, computed, watch } from "vue";
    import { useRouter } from "vue-router";
    import { useGlobalStore } from "../stores/global";
    import { storeToRefs } from "pinia";
    import api from "../api";
    import ProductCard from "../components/ProductCard.vue";
    import ProductSearchBar from "../components/ProductSearchBar.vue";

    const router = useRouter();
    const store = useGlobalStore();
    const { user } = storeToRefs(store);

    const products = ref([]);
    const loading = ref(true);
    const searchText = ref("");
    const currentPage = ref(1);
    const itemsPerPage = ref(12);

    onMounted(async () => {
        if (user.value.isAdmin) {
            router.push({ name: "Admin" });
            return;
        }
        try {
            const resp = await api.get("/products/active");
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
        return products.value.filter((p) =>
            (p.name || p.title || "").toLowerCase().includes(term) ||
            (p.description || "").toLowerCase().includes(term)
        );
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
    });

    const paginatedProducts = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return filteredProducts.value.slice(startIndex, endIndex);
    });

    const pageNumbers = computed(() => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    });

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const nextPage = () => {
        goToPage(currentPage.value + 1);
    };

    const prevPage = () => {
        goToPage(currentPage.value - 1);
    };

    watch(searchText, () => {
        currentPage.value = 1;
    });
</script>

<template>
    <div v-if="!user.isAdmin" class="catalog-page">
        <div class="catalog-container">
            <!-- Page Header -->
            <div class="page-header">
                <h1 class="page-title">Our Products</h1>
                <p class="page-subtitle">Discover our premium collection of authentic items</p>
            </div>

            <!-- Search Bar -->
            <div class="search-section">
                <ProductSearchBar v-model="searchText" class="search-bar" />
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="loading-container">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                </div>
                <p class="loading-text">Loading products...</p>
            </div>

            <!-- Products Grid -->
            <div v-else>
                <!-- No Products Found -->
                <div v-if="filteredProducts.length === 0" class="empty-state">
                    <div class="empty-icon">
                        <i class="bi bi-bag-x"></i>
                    </div>
                    <h3>No products found</h3>
                    <p v-if="searchText">Try adjusting your search terms</p>
                    <p v-else>Check back soon for new items!</p>
                    <button @click="searchText = ''" class="btn-reset" v-if="searchText">
                        Clear Search
                    </button>
                </div>

                <!-- Products -->
                <div v-else class="products-grid">
                    <transition-group name="fade" tag="div" class="grid-wrapper">
                        <div
                            v-for="product in paginatedProducts"
                            :key="product._id || product.id"
                            class="product-item"
                        >
                            <ProductCard :product="product" />
                        </div>
                    </transition-group>
                </div>

                <!-- Results Count -->
                <div class="results-info">
                    <p>Showing {{ paginatedProducts.length }} of {{ filteredProducts.length }} product{{ filteredProducts.length !== 1 ? 's' : '' }}</p>
                </div>

                <!-- Pagination Controls -->
                <div v-if="totalPages > 1" class="pagination-container">
                    <button
                        class="pagination-btn pagination-nav"
                        @click="prevPage"
                        :disabled="currentPage === 1"
                    >
                        <i class="bi bi-chevron-left"></i>
                        Previous
                    </button>

                    <div class="pagination-numbers">
                        <button
                            v-if="pageNumbers[0] > 1"
                            class="pagination-btn"
                            @click="goToPage(1)"
                        >
                            1
                        </button>
                        <span v-if="pageNumbers[0] > 2" class="pagination-ellipsis">...</span>

                        <button
                            v-for="page in pageNumbers"
                            :key="page"
                            class="pagination-btn"
                            :class="{ active: page === currentPage }"
                            @click="goToPage(page)"
                        >
                            {{ page }}
                        </button>

                        <span v-if="pageNumbers[pageNumbers.length - 1] < totalPages - 1" class="pagination-ellipsis">...</span>
                        <button
                            v-if="pageNumbers[pageNumbers.length - 1] < totalPages"
                            class="pagination-btn"
                            @click="goToPage(totalPages)"
                        >
                            {{ totalPages }}
                        </button>
                    </div>

                    <button
                        class="pagination-btn pagination-nav"
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                    >
                        Next
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Page Container */
.catalog-page {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary-bg) 0%, #faf1e8 100%);
    padding: 60px 20px 80px;
}

.catalog-container {
    max-width: 1400px;
    margin: 0 auto;
}

/* Page Header */
.page-header {
    text-align: center;
    margin-bottom: 60px;
}

.page-title {
    font-size: 48px;
    font-weight: 800;
    color: var(--text-dark);
    margin: 0 0 12px 0;
    letter-spacing: -1.5px;
}

.page-subtitle {
    font-size: 18px;
    color: var(--text-secondary);
    margin: 0;
    font-weight: 500;
}

/* Search Section */
.search-section {
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
}

.search-bar {
    width: 100%;
    max-width: 500px;
}

/* Loading State */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 20px;
}

.loading-spinner {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

.spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(214, 69, 69, 0.1);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-text {
    font-size: 16px;
    color: var(--text-secondary);
    font-weight: 500;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 100px 40px;
    background: white;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.empty-icon {
    font-size: 100px;
    color: var(--primary-color);
    opacity: 0.2;
    margin-bottom: 24px;
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
    margin: 0 0 30px 0;
}

.btn-reset {
    padding: 12px 28px;
    background: linear-gradient(135deg, var(--primary-color), #ff6b6b);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(214, 69, 69, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn-reset:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(214, 69, 69, 0.4);
}

/* Products Grid */
.products-grid {
    margin-bottom: 50px;
}

.grid-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.product-item {
    transition: all 0.3s ease;
}

.product-item:hover {
    transform: translateY(-8px);
}

/* Transition Animations */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

/* Results Info */
.results-info {
    text-align: center;
    padding: 20px;
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 500;
}

.results-info p {
    margin: 0;
}

/* Pagination Controls */
.pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 40px 20px;
    flex-wrap: wrap;
}

.pagination-btn {
    min-width: 44px;
    height: 44px;
    padding: 8px 14px;
    background: white;
    border: 2px solid var(--border-color);
    border-radius: 10px;
    color: var(--text-dark);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
}

.pagination-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--primary-color), #ff6b6b);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(214, 69, 69, 0.2);
}

.pagination-btn.active {
    background: linear-gradient(135deg, var(--primary-color), #ff6b6b);
    color: white;
    border-color: var(--primary-color);
    box-shadow: 0 8px 20px rgba(214, 69, 69, 0.3);
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f0f0f0;
}

.pagination-numbers {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
}

.pagination-nav {
    gap: 4px;
    font-weight: 700;
}

.pagination-nav i {
    font-size: 16px;
}

.pagination-ellipsis {
    color: var(--text-secondary);
    font-weight: 600;
    padding: 0 4px;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .page-title {
        font-size: 36px;
    }

    .grid-wrapper {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 20px;
    }
}

@media (max-width: 768px) {
    .catalog-page {
        padding: 40px 16px 60px;
    }

    .page-header {
        margin-bottom: 40px;
    }

    .page-title {
        font-size: 28px;
    }

    .page-subtitle {
        font-size: 16px;
    }

    .search-section {
        margin-bottom: 40px;
    }

    .grid-wrapper {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
    }

    .empty-state {
        padding: 60px 30px;
    }

    .empty-icon {
        font-size: 70px;
    }

    .empty-state h3 {
        font-size: 22px;
    }

    .pagination-container {
        flex-direction: column;
        gap: 16px;
        padding: 30px 16px;
    }

    .pagination-nav {
        width: 100%;
    }

    .pagination-numbers {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .catalog-page {
        padding: 30px 12px 50px;
    }

    .page-title {
        font-size: 24px;
    }

    .page-subtitle {
        font-size: 14px;
    }

    .search-section {
        margin-bottom: 30px;
    }

    .grid-wrapper {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;
    }

    .empty-state {
        padding: 40px 20px;
    }

    .empty-icon {
        font-size: 50px;
    }

    .empty-state h3 {
        font-size: 18px;
    }

    .empty-state p {
        font-size: 14px;
    }
}
</style>
