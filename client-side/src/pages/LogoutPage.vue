<template>
    <div class="logout-container">
        <!-- Confirmation Modal -->
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirm Logout</h5>
                </div>
                <div class="modal-body">
                    <p class="logout-message">Are you sure you want to logout?</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" @click="handleCancel">No, Stay</button>
                    <button class="btn-confirm" @click="handleConfirm">Yes, Logout</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useGlobalStore } from '../stores/global';
    import { useRouter } from 'vue-router';

    const global = useGlobalStore();
    const router = useRouter();

    function handleConfirm() {
        global.logout();
        router.push({ path: '/login' });
    }

    function handleCancel() {
        router.back();
    }
</script>

<style scoped>
.logout-container {
    min-height: 100vh;
    background: rgba(26, 26, 26, 0.3);
    backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(26, 26, 26, 0.3);
    backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.modal-content {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 420px;
    overflow: hidden;
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
    from {
        transform: translateY(40px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-header {
    background: linear-gradient(135deg, var(--primary-bg) 0%, rgba(245, 228, 217, 0.8) 100%);
    border-bottom: 2px solid var(--primary-color);
    padding: 28px 30px;
    text-align: center;
}

.modal-title {
    color: var(--primary-color);
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    letter-spacing: 0.5px;
}

.modal-body {
    padding: 40px;
    text-align: center;
}

.logout-message {
    color: var(--text-secondary);
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
    font-weight: 500;
}

.modal-footer {
    display: flex;
    gap: 12px;
    padding: 20px 40px 40px;
    justify-content: center;
}

.btn-cancel,
.btn-confirm {
    padding: 12px 28px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    letter-spacing: 0.3px;
    text-transform: uppercase;
    min-width: 120px;
}

.btn-cancel {
    background: #e0e0e0;
    color: var(--text-dark);
    border: 2px solid #d0d0d0;
}

.btn-cancel:hover {
    background: #d0d0d0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-confirm {
    background: linear-gradient(135deg, var(--primary-color) 0%, #c23636 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(214, 69, 69, 0.2);
}

.btn-confirm:hover {
    background: linear-gradient(135deg, #c23636 0%, #a82d2d 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(214, 69, 69, 0.3);
}

.btn-confirm:active {
    transform: translateY(0);
}
</style>
