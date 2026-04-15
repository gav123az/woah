<script setup>
    import { ref, watch, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';
    import { useGlobalStore } from '../stores/global';
    import api from '../api';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const globalStore = useGlobalStore();

    const email = ref('');
    const password = ref('');
    const isEnabled = ref(false);

    const notyf = new Notyf();

    watch([email, password], (currentValue, oldValue) => {
        if (currentValue.every(input => input !== "")) {
            isEnabled.value = true;
        } else {
            isEnabled.value = false;
        }
    });

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await api.post('/users/login', {
                email: email.value,
                password: password.value
            });
            const token = response.data.access;
            if (token) {
                localStorage.setItem('token', token);
                await globalStore.getUserDetails(token);

                notyf.success('Login Successful');
                email.value = '';
                password.value = '';

                if (globalStore.user.isAdmin) {
                    router.push({ path: '/admin' });
                } else {
                    router.push({ path: '/products' });
                }
                return;
            }
        } catch (error) {
            if (
                error.response &&
                [404, 401, 400].includes(error.response.status)
            ) {
                notyf.error(error.response.data.message);
            } else {
                console.error(error);
                notyf.error('Login Failed. Please contact administrator.');
            }
        }
    }

    onBeforeMount(() => {
        if (globalStore.user && globalStore.user.token) {
            router.push({ path: '/products' });
        }
    });
</script>

<template>
    <div class="auth-container">
        <h1 class="auth-title">Login Page</h1>
        <div class="auth-form-wrapper">
            <form v-on:submit="handleSubmit" class="auth-form">
                <div class="mb-3">
                    <label for="emailInput" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="emailInput" v-model="email" />
                </div>
                <div class="mb-3">
                    <label for="passwordInput" class="form-label">Password</label>
                    <input type="password" class="form-control" id="passwordInput" v-model="password" />
                </div>
                <div class="d-grid mt-5">
                    <button type="submit" class="btn-submit" v-if="isEnabled">Login</button>
                    <button type="submit" class="btn-submit btn-disabled" disabled v-else>Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.auth-container {
    min-height: calc(100vh - 120px);
    background: var(--primary-bg);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
}

.auth-title {
    color: var(--primary-color);
    font-size: 32px;
    font-weight: 800;
    text-align: center;
    margin-bottom: 40px;
}

.auth-form-wrapper {
    background: white;
    border: 2px solid var(--primary-color);
    border-radius: 12px;
    padding: 40px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 4px 15px rgba(214, 69, 69, 0.15);
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-label {
    color: var(--text-dark);
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 14px;
}

.form-control {
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 10px 12px;
    font-size: 14px;
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(214, 69, 69, 0.1);
}

.btn-submit {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.btn-submit:hover:not(.btn-disabled) {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(214, 69, 69, 0.4);
}

.btn-disabled {
    background: #ccc;
    cursor: not-allowed;
}

.btn-disabled:hover {
    background: #ccc;
    transform: none;
}
</style>
