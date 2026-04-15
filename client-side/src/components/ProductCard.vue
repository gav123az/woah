<template>
    <div class="food-card">
        <div class="food-card-image">
            <i class="bi bi-egg-fried" style="font-size:3rem; color:#d64545;"></i>
        </div>
        <div class="food-card-body">
            <h5 class="food-card-title">{{ cardData.name || cardData.title || 'Japanese Dish' }}</h5>
            <p class="food-card-description">{{ cardData.description }}</p>
            <div class="food-card-footer">
                <span class="food-price" v-if="cardData.price">₱{{ cardData.price }}</span>
                <router-link
                    :to="`/products/${cardData._id}`"
                    class="food-card-link"
                >
                    View Details
                    <i class="bi bi-arrow-right ms-2"></i>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        product: {
            type: Object,
            default: () => ({})
        }
    });
    const cardData = props.product;
</script>

<style scoped>
.food-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.food-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(214, 69, 69, 0.1);
}

.food-card-image {
    text-align: center;
    margin-bottom: 20px;
    padding: 20px 0;
    border-bottom: 2px solid #f5f5f5;
}

.food-card-body {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.food-card-title {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 12px 0;
}

.food-card-description {
    font-size: 14px;
    color: #666;
    margin: 0 0 20px 0;
    line-height: 1.5;
    flex-grow: 1;
}

.food-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}

.food-price {
    font-size: 20px;
    font-weight: 700;
    color: #d64545;
}

.food-card-link {
    color: #d64545;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
}

.food-card-link:hover {
    color: #b83535;
}

.food-card-link i {
    transition: margin 0.3s ease;
}

.food-card-link:hover i {
    margin-left: 8px !important;
}
</style>