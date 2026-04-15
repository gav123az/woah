<script setup>
    import { ref, onMounted } from "vue";
    import api from "../api.js";
    import { Notyf } from "notyf";
    const notyf = new Notyf();

    const products = ref([]);
    const loading = ref(false);
    const error = ref("");
    const showCreateModal = ref(false);
    const editMode = ref(false);

    const createForm = ref({
        name: "",
        description: "",
        price: "",
        stock: ""
    });

    function openCreateModal() {
        showCreateModal.value = true;
    }
    function closeCreateModal() {
        showCreateModal.value = false;
        createForm.value = { name: "", description: "", price: "", stock: "" };
        error.value = "";
    }

    async function fetchProducts() {
        try {
            const { data } = await api.get("/products/all");
            products.value = data.products ?? data ?? [];
        } catch {
            error.value = "Failed to fetch products.";
        }
    }

    async function handleCreateProduct() {
        loading.value = true;
        error.value = "";
        try {
            await api.post("/products", {
                ...createForm.value,
                price: Number(createForm.value.price),
                stock: Number(createForm.value.stock)
            });
            await fetchProducts();
            closeCreateModal();
            notyf.success("Product added successfully!");
        } catch (err) {
            error.value = err?.response?.data?.error || err?.response?.data?.message || "Failed to add product.";
            notyf.error(error.value);
        } finally {
            loading.value = false;
        }
    }

    const editForm = ref({
        _id: null,
        name: "",
        description: "",
        price: "",
        stock: ""
    });
    const editLoading = ref(false);
    const editError = ref("");

    function startEdit(product) {
        editForm.value = {
            _id: product._id,
            name: product.name,
            description: product.description ?? "",
            price: product.price,
            stock: product.stock
        };
        editMode.value = true;
    }
    function closeEdit() {
        editMode.value = false;
        editForm.value = { _id: null, name: "", description: "", price: "", stock: "" };
        editError.value = "";
    }

    async function handleEditProduct() {
        editLoading.value = true;
        editError.value = "";
        try {
            await api.patch("/products/" + editForm.value._id + "/update", {
                name: editForm.value.name,
                description: editForm.value.description,
                price: Number(editForm.value.price),
                stock: Number(editForm.value.stock),
            });
            await fetchProducts();
            closeEdit();
            notyf.success("Product updated successfully!");
        } catch (err) {
            editError.value = err?.response?.data?.message || "Failed to update product.";
        } finally {
            editLoading.value = false;
        }
    }

    
    async function toggleActive(product) {
        try {
            await api.patch(`/products/${product._id}/${product.isActive ? "archive" : "activate"}`);
            await fetchProducts();
        } catch {
            error.value = `Failed to ${product.isActive ? "deactivate" : "reactivate"} product.`;
        }
    }

    onMounted(() => {
        fetchProducts();
    });
</script>

<template>
    <div class="admin-container">
        <div class="admin-header">
            <h1 class="admin-title">Admin Dashboard</h1>
            <button class="btn-add-product" @click="openCreateModal">
                <i class="bi bi-plus-lg me-2"></i> Add Product
            </button>
        </div>
        <div class="products-table-wrapper">
            <table class="products-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Availability</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products" :key="product._id" class="product-row">
                        <td>{{ product._id }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.description }}</td>
                        <td>${{ product.price }}</td>
                        <td>{{ product.stock }}</td>
                        <td>
                            <span class="status-badge" :class="{ 'status-active': product.isActive, 'status-inactive': !product.isActive }">
                                {{ product.isActive ? 'Available' : 'Unavailable' }}
                            </span>
                        </td>
                        <td class="actions-cell">
                            <button class="btn-action btn-edit" @click="startEdit(product)">Edit</button>
                            <button 
                                class="btn-action" 
                                :class="product.isActive ? 'btn-deactivate' : 'btn-activate'"
                                @click="toggleActive(product)">
                                {{ product.isActive ? 'Deactivate' : 'Reactivate' }}
                            </button>
                        </td>
                    </tr>
                    <tr v-if="!products.length">
                        <td colspan="7" class="no-products">No products found.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Add Product Modal -->
        <div v-if="showCreateModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add Product</h5>
                    <button class="modal-close" @click="closeCreateModal">×</button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleCreateProduct">
                        <div class="form-group">
                            <label class="form-label">Name</label>
                            <input v-model="createForm.name" type="text" class="form-input" placeholder="Enter product name" required />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <input v-model="createForm.description" type="text" class="form-input" placeholder="Enter product description" required />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Price</label>
                            <input v-model.number="createForm.price" type="number" min="0" step="any" class="form-input" placeholder="Enter price" required />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Stock</label>
                            <input v-model.number="createForm.stock" type="number" min="0" class="form-input" placeholder="Enter stock" required />
                        </div>
                        
                        <button :disabled="loading" type="submit" class="btn-submit">
                            {{ loading ? 'Adding...' : 'Add Product' }}
                        </button>
                        <div v-if="error" class="error-alert">{{ error }}</div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Edit Product Modal -->
        <div v-if="editMode" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Product</h5>
                    <button class="modal-close" @click="closeEdit">×</button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleEditProduct">
                        <div class="form-group">
                            <label class="form-label">Name</label>
                            <input v-model="editForm.name" type="text" class="form-input" required placeholder="Enter new name" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <input v-model="editForm.description" type="text" class="form-input" required placeholder="Enter new description" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Price</label>
                            <input v-model.number="editForm.price" type="number" min="0" step="any" class="form-input" required placeholder="Enter new price" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Stock</label>
                            <input v-model.number="editForm.stock" type="number" min="0" class="form-input" required placeholder="Enter new stock" />
                        </div>
                        <button :disabled="editLoading" type="submit" class="btn-submit">
                            {{ editLoading ? 'Saving...' : 'Save Changes' }}
                        </button>
                        <div v-if="editError" class="error-alert">{{ editError }}</div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-container {
    min-height: calc(100vh - 120px);
    background: var(--primary-bg);
    padding: 40px 20px;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
}

.admin-title {
    color: var(--primary-color);
    font-size: 36px;
    font-weight: 800;
    margin: 0;
}

.btn-add-product {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(214, 69, 69, 0.3);
}

.btn-add-product:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(214, 69, 69, 0.4);
}

.products-table-wrapper {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
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

.btn-edit {
    background: var(--primary-color);
    color: white;
}

.btn-edit:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
}

.btn-deactivate {
    background: #ffc107;
    color: #000;
}

.btn-deactivate:hover {
    background: #e0a800;
}

.btn-activate {
    background: #28a745;
    color: white;
}

.btn-activate:hover {
    background: #218838;
}

.no-products {
    text-align: center;
    color: #999;
    font-style: italic;
}

/* Modal Styles - Modern Japanese Inspired */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(26, 26, 26, 0.6);
    backdrop-filter: blur(4px);
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
    max-width: 520px;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.modal-header::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
    opacity: 0.5;
}

.modal-title {
    color: var(--primary-color);
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    letter-spacing: 0.5px;
}

.modal-close {
    background: none;
    border: none;
    font-size: 32px;
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.3s ease;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.modal-close:hover {
    color: var(--primary-dark);
    background: rgba(214, 69, 69, 0.08);
    transform: rotate(90deg);
}

.modal-body {
    padding: 40px;
}

.form-group {
    margin-bottom: 24px;
}

.form-label {
    display: block;
    color: var(--text-dark);
    font-weight: 500;
    margin-bottom: 10px;
    font-size: 13px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    opacity: 0.8;
}

.form-input {
    width: 100%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 14px 16px;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
    background: #fafafa;
    font-family: inherit;
}

.form-input::placeholder {
    color: #999;
    opacity: 0.7;
}

.form-input:focus {
    outline: none;
    border-color: var(--primary-color);
    background: white;
    box-shadow: 0 0 0 4px rgba(214, 69, 69, 0.08), inset 0 1px 0 rgba(0, 0, 0, 0.04);
}

.btn-submit {
    width: 100%;
    background: linear-gradient(135deg, var(--primary-color) 0%, #c23636 100%);
    color: white;
    border: none;
    padding: 14px 24px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: 8px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    box-shadow: 0 4px 12px rgba(214, 69, 69, 0.2);
}

.btn-submit:hover:not(:disabled) {
    background: linear-gradient(135deg, #c23636 0%, #a82d2d 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(214, 69, 69, 0.3);
}

.btn-submit:active:not(:disabled) {
    transform: translateY(0);
}

.btn-submit:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
}

.error-alert {
    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    color: #721c24;
    padding: 14px 16px;
    border-radius: 10px;
    margin-top: 20px;
    font-size: 13px;
    border-left: 4px solid #dc3545;
    font-weight: 500;
}
</style>
