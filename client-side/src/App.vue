<script setup>
    import NavbarComponent from './components/NavbarComponent.vue';
    import { useGlobalStore } from './stores/global';
    import { onMounted } from 'vue';

    const store = useGlobalStore();

    onMounted(() => {
        const token = localStorage.getItem("token");
        if (token) {
            store.getUserDetails(token);
        }
    });
</script>

<template>
    <NavbarComponent />
    <router-view />
</template>