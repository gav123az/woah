// Imports from the bootstrap library
// This will allow us to use bootstrap in all components (universal)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

// Import the styling library of notyf to the whole project.
import 'notyf/notyf.min.css';

import { createApp } from 'vue'
import './style.css'
// Inject our global store into our main.js to allow all components to access our store.
import { createPinia } from 'pinia';
import App from './App.vue'

// Import the Page components here to setup the routing in your app.
import HomePage from './pages/HomePage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import LoginPage from './pages/LoginPage.vue';
import LogoutPage from './pages/LogoutPage.vue';
import ErrorPage from './pages/ErrorPage.vue';
import ProductCatalogPage from './pages/ProductCatalogPage.vue';
import ProductDetailsPage from './pages/ProductDetailsPage.vue';
import OrdersPage from './pages/OrdersPage.vue';
import AdminDashboardPage from './pages/AdminDashboardPage.vue';
import CartPage from './pages/CartPage.vue';

import { createRouter, createWebHistory } from 'vue-router';

// Route Configuration using Vue-Router:
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomePage
        },
        {
            path: '/products',
            name: 'ProductCatalog',
            component: ProductCatalogPage
        },
        {
            path: '/products/:productId',
            name: 'ProductDetails',
            component: ProductDetailsPage
        },
        {
            path: '/register',
            name: 'Register',
            component: RegisterPage
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginPage
        },
        {
            path: '/logout',
            name: 'Logout',
            component: LogoutPage
        },
        {
            path: '/orders',
            name: 'Orders',
            component: OrdersPage,
            meta: { requiresAuth: true }
        },
        {
            path: '/cart',
            name: 'Cart',
            component: CartPage,
            meta: { requiresAuth: true }
        },
        {
            path: '/admin',
            name: 'Admin',
            component: AdminDashboardPage,
            meta: { requiresAdmin: true }
        },
        {
            path: '/:catchAll(.*)',
            component: ErrorPage
        }
    ]
});

const app = createApp(App);

// createPinia() is a library that will allow us to use and manage our Pinia stores in our app.
app.use(createPinia());

// app.use() will allows us to use global libraries to our Vue app such as this router.
app.use(router);

/**
 * Best-practice: Register Pinia, Router, then attach route guards, THEN mount.
 */
import { useGlobalStore } from './stores/global.js';

// Add navigation guards (strict, safe)
router.beforeEach((to, from, next) => {
    // Always get the latest store instance
    const store = useGlobalStore();
    const token = store.user.token;
    const isAdmin = store.user.isAdmin;

    if(to.meta.requiresAdmin) {
        if (!token) {
            // Not logged in at all
            next({ name: 'Login' });
        } else if (!isAdmin) {
            // Logged in, not admin
            next({ name: 'Home' });
        } else {
            next();
        }
    } else if(to.meta.requiresAuth) {
        if (!token) {
            // Not logged in at all
            next({ name: 'Login' });
        } else {
            next();
        }
    } else {
        next();
    }
});

// Mount or render the app components into the HTML element.
app.mount('#app');
