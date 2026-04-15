<script setup>
    const props = defineProps({
        bannerProps: Object
    });
</script>

<template>
    <div class="row align-items-center py-5 banner-gradient" id="banner" style="min-height:420px;">
        <div class="col-md-6 p-5 d-flex flex-column justify-content-center h-100" style="max-width:480px;margin-left:32px;">
            <h1 class="mb-4" id="banner-title">{{bannerProps.title}}</h1>
            <p class="mb-4 fs-5" id="motto">{{bannerProps.tagline}}</p>
            <router-link class="btn btn-primary btn-lg rounded-pill px-3 w-auto" :to="{ name: bannerProps.destination }" style="max-width:320px;">{{bannerProps.buttonLabel}} <i class="bi bi-arrow-right"></i></router-link>
        </div>
    </div>
</template>


<style scoped>

</style>
