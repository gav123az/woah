<script setup>
    import { watch, ref, onBeforeMount } from "vue";
    import { Notyf } from "notyf";
    import { useRouter } from "vue-router";
    import { useGlobalStore } from "../stores/global";
    import api from "../api";

    const firstName = ref("");
    const lastName = ref("");
    const mobileNo = ref("");
    const email = ref("");
    const password = ref("");
    const isEnabled = ref(false);

    const notyf = new Notyf();
    const router = useRouter();
    const globalStore = useGlobalStore();

    watch([firstName, lastName, email, mobileNo, password], (currentValue) => {
        isEnabled.value = currentValue.every((input) => input !== "") && password.value.length >= 8;
    });

    async function handleSubmit() {
        try {
            await api.post("/users/register", {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                mobileNo: mobileNo.value,
                password: password.value
            });

            notyf.success("Registration Successful");
            firstName.value = "";
            lastName.value = "";
            mobileNo.value = "";
            email.value = "";
            password.value = "";

            router.push({ path: "/login" });
        } catch (error) {
            if (
                error.response &&
                [404, 401, 400, 409].includes(error.response.status)
            ) {
                notyf.error(error.response.data.message);
            } else {
                console.error(error);
                notyf.error("Registration Failed. Please contact administrator.");
            }
        }
    }

    onBeforeMount(() => {
        if (globalStore.user && globalStore.user.token) {
            if (globalStore.user.isAdmin) {
                router.push({ name: "Admin" });
            } else {
                router.push({ path: "/products" });
            }
        }
    });
</script>


<template>
    <div class="auth-container">
        <h1 class="auth-title">Register Page</h1>
        <div class="auth-form-wrapper">
            <form v-on:submit.prevent="handleSubmit" class="auth-form">
                <div class="mb-3">
                    <label for="fName" class="form-label">First Name</label>
                    <input type="text" class="form-control" id="fName" v-model="firstName" />
                </div>
                <div class="mb-3">
                    <label for="lName" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="lName" v-model="lastName" />
                </div>
                <div class="mb-3">
                    <label for="mobile" class="form-label">Mobile Number</label>
                    <input type="text" class="form-control" id="mobile" v-model="mobileNo" />
                </div>
                <div class="mb-3">
                    <label for="emailInput" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="emailInput" v-model="email" />
                </div>
                <div class="mb-3">
                    <label for="passwordInput" class="form-label">Password</label>
                    <input type="password" class="form-control" id="passwordInput" v-model="password" />
                </div>
                <div class="d-grid mt-5">
                    <button type="submit" class="btn-submit" v-if="isEnabled">Submit</button>
                    <button type="submit" class="btn-submit btn-disabled" disabled v-else>Submit</button>
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