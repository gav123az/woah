import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'notyf/notyf.min.css';

import { createApp } from 'vue';
import './style.css';
import { createPinia } from 'pinia';
import App from './App.vue';

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
import ProfilePage from './pages/ProfilePage.vue';

import { createRouter, createWebHistory } from 'vue-router';

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
            component: OrdersPage
        },
        {
            path: '/cart',
            name: 'Cart',
            component: CartPage
        },
        {
            path: '/profile',
            name: 'Profile',
            component: ProfilePage
        },
        {
            path: '/admin',
            name: 'Admin',
            component: AdminDashboardPage
        },
        {
            path: '/:catchAll(.*)',
            component: ErrorPage
        }
    ]
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');