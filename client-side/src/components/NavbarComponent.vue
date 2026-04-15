<script setup>
    import { ref, onBeforeMount } from 'vue';
    import { useGlobalStore } from '../stores/global';
    import { storeToRefs } from 'pinia';

    const store = useGlobalStore();
    const { user } = storeToRefs(store);

    onBeforeMount(() => {
        if (user.value.token && !user.value.email) {
            store.getUserDetails(user.value.token);
        }
    });
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container-fluid">
            <router-link :to="{ name: 'Home'}" class="navbar-brand text-dark fw-bold">SUSHIMAN</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <div class="navbar-nav ms-auto">
                    <router-link :to="{ name: 'ProductCatalog' }" class="nav-link ms-2 me-2 fw-semibold" v-if="!user.isAdmin">FOODS</router-link>
                    <router-link :to="{ name: 'Cart' }" class="nav-link ms-2 me-2 fw-semibold" v-if="user.token && !user.isAdmin">Cart</router-link>
                    <router-link :to="{ name: 'Orders' }" class="nav-link ms-2 me-2 fw-semibold" v-if="user.token">Orders</router-link>
                    <router-link :to="{ name: 'Admin' }" class="nav-link ms-2 me-2 fw-semibold" v-if="user.token && user.isAdmin">Admin Dashboard</router-link>
                    <router-link :to="{ name: 'Register' }" class="nav-link ms-2 me-2 fw-semibold" v-if="!user.token">Register</router-link>
                    <router-link :to="{ name: 'Login' }" class="nav-link ms-2 me-2 fw-semibold" v-if="!user.token">Login</router-link>
                    <router-link :to="{ name: 'Logout' }" class="nav-link ms-2 me-2 fw-semibold" v-if="user.token">Logout</router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    background: var(--primary-bg);
    box-shadow: none;
    padding: 0;
    border: none;
    border-bottom: 2px solid var(--primary-color);
}

.container-fluid {
    padding: 0 40px;
    max-width: 100%;
}

.navbar-brand {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: var(--primary-color) !important;
    text-decoration: none;
    margin-right: 60px;
    transition: all 0.3s ease;
}

.navbar-brand:hover {
    opacity: 0.8;
}

.navbar-nav {
    gap: 0;
    align-items: center;
}

.nav-link {
    color: var(--primary-color) !important;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    padding: 28px 18px !important;
    margin: 0 !important;
    position: relative;
    transition: all 0.3s ease;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color) 0%, #ff6b6b 100%);
    transition: width 0.3s ease;
}

.nav-link:hover {
    color: var(--primary-color) !important;
    background: rgba(214, 69, 69, 0.05);
}

.nav-link:hover::after {
    width: 100%;
}

.navbar-toggler {
    border: none;
    padding: 0.25rem 0.75rem;
    margin-left: auto;
}

.navbar-toggler:focus {
    box-shadow: none;
    outline: none;
}

@media (max-width: 991px) {
    .container-fluid {
        padding: 0 20px;
    }
    
    .navbar-brand {
        margin-right: 20px;
    }
    
    .nav-link {
        padding: 12px 0 !important;
        font-size: 14px;
    }
    
    .nav-link::after {
        display: none;
    }
    
    .nav-link:hover::after {
        display: none;
    }
}
</style>