<script setup>
import { ref } from "vue";
import { useGlobalStore } from "../stores/global";
import api from "../api";

const globalStore = useGlobalStore();
const user = globalStore.user;

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");
const showChangePassword = ref(false);
const showEmailDetail = ref(false);
const showMobileDetail = ref(false);

function toggleChangePass() {
    showChangePassword.value = !showChangePassword.value;
    if (showChangePassword.value) {
        showEmailDetail.value = false;
        showMobileDetail.value = false;
    }
}
function toggleShowEmail() {
    showEmailDetail.value = !showEmailDetail.value;
    if (showEmailDetail.value) {
        showMobileDetail.value = false;
        showChangePassword.value = false;
    }
}
function toggleShowMobile() {
    showMobileDetail.value = !showMobileDetail.value;
    if (showMobileDetail.value) {
        showEmailDetail.value = false;
        showChangePassword.value = false;
    }
}

async function handleChangePassword() {
    error.value = "";
    success.value = "";

    if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
        error.value = "All fields are required.";
        return;
    }
    if (newPassword.value !== confirmPassword.value) {
        error.value = "New passwords do not match.";
        return;
    }
    loading.value = true;
    try {
        await api.patch("/users/update-password", {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value
        }, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });
        success.value = "Password successfully changed!";
        oldPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
    } catch (err) {
        error.value = err?.response?.data?.message || "Failed to update password.";
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="profile-profile-root">
        <div class="profile-profile-header"></div>
        <div class="profile-profile-card">
            <div class="profile-avatar-container">
                <div class="profile-avatar-circle">
                    <span class="profile-avatar-initial">
                        {{ user.firstName ? user.firstName[0] : '?' }}
                    </span>
                </div>
            </div>
            <div class="profile-name">
                <span class="profile-firstname">{{ user.firstName }}</span>
                <span class="profile-lastname">{{ user.lastName }}</span>
            </div>
            <div class="profile-role">
                {{ user.isAdmin ? 'Admin' : 'User' }}
            </div>
            <div class="profile-sections">
                <div class="profile-section-row" style="cursor:default;">
                    <i class="bi bi-envelope"></i>
                    <span>Email Address</span>
                    <span class="profile-row-value" style="margin-left:auto;">
                        <a
                            :href="'mailto:' + user.email"
                            class="profile-email"
                            :title="user.email"
                            style="color:inherit;text-decoration:none;"
                        >{{ user.email }}</a>
                    </span>
                </div>
                <div class="profile-section-row" style="cursor:default;">
                    <i class="bi bi-phone"></i>
                    <span>Mobile Number</span>
                    <span class="profile-row-value" style="margin-left:auto;">
                        <a
                            :href="'tel:' + (user.mobileNo ? user.mobileNo.replace(/[^0-9\+]/g, '') : '')"
                            class="profile-phone"
                            :title="user.mobileNo"
                            style="color:inherit;text-decoration:none;"
                        >{{ user.mobileNo }}</a>
                    </span>
                </div>
                <div class="profile-section-row profile-section-row-btn" @click="toggleChangePass">
                    <i class="bi bi-lock"></i>
                    <span>Password</span>
                    <i class="bi bi-chevron-right profile-row-arrow"></i>
                </div>
                <div v-if="showChangePassword" class="profile-section-form">
                    <form class="profile-form" @submit.prevent="handleChangePassword">
                        <div class="form-group">
                            <label for="oldPassword">Old Password</label>
                            <input
                                type="password"
                                id="oldPassword"
                                v-model="oldPassword"
                                required
                                class="form-input"
                            />
                        </div>
                        <div class="form-group">
                            <label for="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                v-model="newPassword"
                                required
                                class="form-input"
                            />
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                v-model="confirmPassword"
                                required
                                class="form-input"
                            />
                        </div>
                        <button type="submit" class="btn-save" :disabled="loading">
                            {{ loading ? "Updating..." : "Change Password" }}
                        </button>
                        <div v-if="error" class="form-error">{{ error }}</div>
                        <div v-if="success" class="form-success">{{ success }}</div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profile-profile-root {
    min-height: 100vh;
    background: var(--primary-bg);
}
.profile-profile-header {
    background: linear-gradient(135deg, var(--primary-color) 0%, #ecdcd6 100%);
    height: 150px;
    border-bottom-left-radius: 24px;
    border-bottom-right-radius: 24px;
    margin-bottom: -78px;
}
.profile-profile-card {
    background: #fff;
    max-width: 450px;
    width: 96%;
    margin: 0 auto;
    border-radius: 18px;
    box-shadow: 0 8px 36px #d6454532, 0 8px 40px 8px #e0b0a9;
    padding: 40px 22px 38px 22px;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.profile-avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    top: -74px;
    /* Avatar Shadow */
    filter: drop-shadow(0 2px 32px #d6454544);
}
.profile-avatar-circle {
    width: 108px;
    height: 108px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-color) 80%, #fad2d2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    border: 6px solid #fff;
    box-shadow: 0 7px 55px #d6454580;
}
    .profile-avatar-initial {
        color: white;
        font-size: 2.9rem;
        font-weight: 800;
        letter-spacing: 1px;
    }
    .profile-name {
        margin-top: 8px;
        margin-bottom: 8px;
        font-size: 1.35rem;
        font-weight: 700;
        color: #222;
        text-align: center;
        letter-spacing: .01em;
    }
    .profile-role {
        margin-bottom: 24px;
        text-align: center;
        font-size: 1.03rem;
        color: #b0837b;
        letter-spacing: .032em;
        font-weight: 500;
    }
    .profile-firstname {
        color: var(--text-dark);
        font-weight: 900;
    }
    .profile-lastname {
        color: var(--primary-color);
        font-weight: 600;
        margin-left: 2px;
    }
    
    .profile-sections {
        width: 100%;
        margin-top: 0;
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    .profile-section-row {
        display: flex;
        align-items: center;
        gap: 14px;
        background: #fdeaea;
        border-radius: 14px;
        margin: 0;
        font-size: 1.09rem;
        font-weight: 600;
        padding: 13px 19px 13px 16px;
        color: var(--primary-color);
        box-shadow: 0 2.5px 18px #e1a1a13b;
        transition: background 0.18s, color 0.22s;
        border: 1.5px solid #f6d4d4;
    }
    .profile-section-row:hover {
        background: #fff2f2;
        color: var(--primary-dark);
    }
    .profile-section-row i {
        font-size: 1.15em;
    }
    .profile-row-arrow {
        margin-left: auto;
        color: #b83a3a;
    }
    .profile-row-value {
        margin-left: auto;
        font-size: 1.04rem;
        color: #a94646;
        font-family: 'Fira Mono', monospace;
        font-weight: 500;
        opacity: 0.88;
    }
    .profile-email {
        max-width: 165px;
        background: none;
        font-size: 1.04rem;
        font-family: 'Fira Mono', monospace;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: right;
    }
    .profile-phone {
        min-width: 90px;
        text-align: right;
    }
    .profile-section-row-btn {
        cursor: pointer;
        user-select: none;
    }
    .profile-section-form {
        width: 100%;
        margin-top: 10px;
        margin-bottom: 2px;
    }
    .profile-section-info {
        width: 100%;
        background: #fff4ea;
        border-radius: 13px;
        margin-top: 7px;
        margin-bottom: 6px;
        box-shadow: 0 1px 10px #e7bba8a1;
        padding: 14px 15px 10px 20px;
        font-size: 1.07rem;
        color: #993a3a;
        display: flex;
        flex-direction: column;
        gap: 6px;
        text-align: left;
    }
    .profile-form {
        margin-top: 7px;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .form-input {
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 11px;
        font-size: 1rem;
        font-family: inherit;
    }
    .form-input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 1px 0 2px rgba(214, 69, 69, 0.09);
    }
    .btn-save {
        padding: 12px 20px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 10px;
        transition: all 0.3s;
    }
    .btn-save:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
    .form-error {
        color: #d82f2f;
        background: #fdeaea;
        padding: 10px;
        border-radius: 6px;
        font-size: .98rem;
    }
    .form-success {
        color: #218838;
        background: #eaf7ee;
        padding: 10px;
        border-radius: 6px;
        font-size: .98rem;
    }
    @media (min-width: 700px) {
        .profile-profile-card {
            box-shadow: 0 18px 48px #d6454520, 0 6px 44px 3px #f4cfc7;
        }
    }
    .profile-section-info {
        width: 100%;
        background: #fff4ea;
        border-radius: 13px;
        margin-top: 7px;
        margin-bottom: 6px;
        box-shadow: 0 1px 10px #e7bba8a1;
        padding: 14px 15px 10px 20px;
        font-size: 1.07rem;
        color: #993a3a;
        display: flex;
        flex-direction: column;
        gap: 6px;
        text-align: left;
    }
    .detail-label {
        font-size: .97em;
        color: #ce4532;
        font-weight: 600;
        margin-bottom: 2px;
        letter-spacing: .01em;
    }
    .detail-link {
        color: #c62e2e;
        font-size: 1.11rem;
        font-family: 'Fira Mono', monospace;
        word-break: break-all;
        padding: 2px 0;
        text-decoration: underline dotted;
        transition: color 0.13s;
    }
    .detail-link:hover, .detail-link:focus {
        color: #d97045;
        outline: none;
    }
</style>