<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else class="d-flex justify-content-center">
      <div class="card shadow" style="max-width: 500px; width: 100%;">
        <div class="card-body">
          <h2 class="card-title fw-bold">{{ product.name }}</h2>
          <p class="card-text">{{ product.description }}</p>
          <ul class="list-unstyled mb-3">
            <li><strong>Price:</strong> {{ product.price }}</li>
            <li><strong>Stock:</strong> {{ product.stock }}</li>
            <li>
              <strong>Status:</strong>
              <span :class="product.isActive ? 'text-success':'text-danger'">
                {{ product.isActive ? 'Active' : 'Inactive' }}
              </span>
            </li>
          </ul>
         <div v-if="product.isActive && product.stock > 0" class="mt-3">
            <div class="d-flex align-items-center mb-3">
              <label for="quantity" class="me-2 mb-0"><strong>Quantity:</strong></label>
              <button class="btn btn-outline-secondary btn-sm" @click="decrement" :disabled="quantity <= 1">-</button>
              <input id="quantity" class="form-control mx-2" type="number" style="width:60px;display:inline-block" v-model="quantity" :min="1" :max="product.stock" readonly>
              <button class="btn btn-outline-secondary btn-sm" @click="increment" :disabled="quantity >= product.stock">+</button>
            </div>
            <button class="btn btn-primary me-2" @click="addToCart">Add to Cart</button>
            <button class="btn btn-success" @click="buyNow">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import api from '../api';

    const route = useRoute();
    const productId = route.params.productId;

    const product = ref({});
    const loading = ref(true);
    const error = ref('');
    const quantity = ref(1);

    // Quantity selector methods
    function decrement() {
      if (quantity.value > 1) quantity.value--;
    }
    function increment() {
      if (quantity.value < (product.value.stock || 1)) quantity.value++;
    }

    onMounted(async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        product.value = response.data.product || response.data;
      } catch (err) {
        error.value = err?.response?.data?.message || 'Failed to fetch product.';
      } finally {
        loading.value = false;
      }
    });

    // Add to Cart button handler
    const addToCart = async () => {
      try {
        await api.post(
          '/cart/add-to-cart',
          { productId, quantity: quantity.value },
          
        );
        alert('Added to cart!');
      } catch (err) {
        alert(err?.response?.data?.message || 'Add to cart failed');
      }
    };

    // Buy Now button handler
    import { useRouter } from 'vue-router';
    const router = useRouter();
    const buyNow = async () => {
      router.push('/orders');
    };
</script>
