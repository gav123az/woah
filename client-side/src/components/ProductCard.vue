<script setup>  
    import { useRouter } from "vue-router";  
  
    const props = defineProps({  
        product: { type: Object, default: () => ({}) },  
    });  
  
    const cardData = props.product;  
  
    const router = useRouter();  
  
    function goToDetails() {  
        if (!cardData?._id) return;  
        router.push(`/products/${cardData._id}`);  
    }  
</script> 

<template>  
    <div  
        class="product-card"  
        role="link"  
        tabindex="0"  
        @click="goToDetails"  
        @keyup.enter="goToDetails"  
    >  
        <!-- Image Circle -->
        <div class="image-container">
            <div class="image-wrapper">
                <div class="image-circle" v-if="!cardData.url">
                    <i class="bi bi-egg-fried"></i>
                </div>
                <img
                    v-else
                    :src="cardData.url"
                    alt="Product image"
                    class="product-image"
                    @error="e => { e.target.style.display = 'none'; }"
                />
            </div>
        </div>
  
        <!-- Content Section -->
        <div class="content-section">  
            <!-- Title -->
            <h3 class="product-title">  
                {{ cardData.name || cardData.title || "Japanese Dish" }}  
            </h3>  
    
            <!-- Description -->
            <p v-if="cardData.description" class="product-description">  
                {{ cardData.description }}  
            </p>  
  
            <!-- Price and Stock Info -->
            <div class="info-section">  
                <div class="price-info">
                    <span class="price-label">$ </span>
                    <span class="price-value">{{ cardData.price != null ? cardData.price : "0" }}</span>
                </div>  
  
                <div v-if="typeof cardData.stock === 'number'" class="stock-info">  
                    <span v-if="cardData.stock > 0" class="stock-badge in-stock">  
                        In stock {{ cardData.stock }}  
                    </span>  
                    <span v-else class="stock-badge out-stock">Sold out</span>  
                </div>  
            </div>  
  
            <!-- Link -->
            <router-link  
                :to="`/products/${cardData._id}`"  
                class="view-details-link"  
                @click.stop  
            >  
                View Details  
                <i class="bi bi-arrow-right"></i>  
            </router-link>  
        </div>  
    </div>  
</template>  
  
<style scoped>  
    .product-card {  
        cursor: pointer;  
        background: #ffffff;  
        border: 1px solid #f0f0f0;  
        border-radius: 20px;  
        padding: 20px 16px;  
        height: 100%;  
        width: 100%;  
        max-width: 340px;  
        margin: 0 auto;  
        display: flex;  
        flex-direction: column;  
        align-items: center;  
        font-family: "Noto Sans JP", "Inter", system-ui, sans-serif;  
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);  
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);  
        text-align: center;
    }  
  
    .product-card:hover {  
        transform: translateY(-8px);  
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);  
        border-color: #e0e0e0;
    }  
  
    /* Image Container */
    .image-container {  
        width: 100%;  
        display: flex;  
        justify-content: center;  
        margin-bottom: 24px;  
    }  
  
    .image-wrapper {
        position: relative;
        width: 200px;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .image-circle {  
        width: 200px;
        height: 200px;
        border-radius: 12px;  
        background: linear-gradient(135deg, #f5f5f5 0%, #ebebeb 100%);  
        display: flex;  
        align-items: center;  
        justify-content: center;  
        box-shadow: 0 8px 24px rgba(214, 69, 69, 0.18);  
    }  
  
    .image-circle i {  
        font-size: 4.5rem;  
        color: #d64545;  
        opacity: 0.7;
    }  
  
    .product-image {
        width: 200px;
        height: 200px;
        border-radius: 12px;
        object-fit: cover;
        box-shadow: 0 8px 24px rgba(214, 69, 69, 0.18);
    }

    /* Content Section */
    .content-section {  
        display: flex;  
        flex-direction: column;  
        width: 100%;  
        flex: 1;  
        gap: 12px;
    }  
  
    /* Title */
    .product-title {  
        font-size: 1.15rem;  
        font-weight: 600;  
        color: #1a1a1a;  
        letter-spacing: 0.01em;  
        margin: 0;  
        line-height: 1.4;
    }  
  
    /* Description */
    .product-description {  
        font-size: 0.85rem;  
        color: #666666;  
        line-height: 1.6;  
        margin: 8px 0 0 0;  
        opacity: 0.85;
    }  
  
    /* Info Section */
    .info-section {  
        display: flex;  
        justify-content: center;  
        align-items: center;  
        gap: 12px;  
        margin-top: 12px;  
        flex-wrap: wrap;
    }  
  
    .price-info {  
        display: inline-flex;
        align-items: baseline;
        gap: 2px;
        background: rgba(214, 69, 69, 0.08);  
        color: #d64545;  
        font-weight: 700;  
        padding: 6px 12px;  
        border-radius: 6px;  
        font-size: 0.95rem;  
    }

    .price-label {
        font-size: 0.85rem;
        opacity: 0.8;
    }

    .price-value {
        font-size: 1rem;
    }
  
    .stock-info {
        display: inline-flex;
    }

    .stock-badge {  
        font-size: 0.75rem;  
        padding: 6px 10px;  
        border-radius: 6px;  
        font-weight: 600;  
        letter-spacing: 0.03em;  
        text-transform: capitalize;
    }  
  
    .in-stock {  
        background: rgba(42, 122, 68, 0.08);  
        color: #2a7a44;  
    }  
  
    .out-stock {  
        background: rgba(179, 58, 58, 0.08);  
        color: #b33a3a;  
    }  
  
    /* Link */
    .view-details-link {  
        font-size: 0.85rem;  
        color: #1a1a1a;  
        text-decoration: none;  
        display: inline-flex;  
        align-items: center;  
        justify-content: center;
        gap: 6px;  
        margin-top: 12px;
        transition: all 0.3s ease;  
        position: relative;
        font-weight: 500;
    }  
  
    .view-details-link::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        width: 0;
        height: 2px;
        background: #d64545;
        transform: translateX(-50%);
        transition: width 0.3s ease;
    }
  
    .view-details-link:hover {  
        color: #d64545;  
    }  
  
    .view-details-link:hover::after {
        width: 100%;
    }

    .view-details-link i {  
        transition: transform 0.3s ease;  
        font-size: 0.8rem;
    }  
  
    .view-details-link:hover i {  
        transform: translateX(3px);  
    }  

    /* Responsive */
    @media (max-width: 640px) {
        .product-card {
            padding: 24px 20px;
            max-width: 100%;
        }

        .image-wrapper {
            width: 160px;
            height: 160px;
        }

        .image-circle {
            width: 160px;
            height: 160px;
        }

        .product-image {
            width: 160px;
            height: 160px;
        }

        .product-title {
            font-size: 1rem;
        }

        .product-description {
            font-size: 0.8rem;
        }
    }
</style>  