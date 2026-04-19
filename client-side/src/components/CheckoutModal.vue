<script setup>
    import { ref, watch, computed } from "vue";

    const props = defineProps({
        visible: Boolean,
        title: {
            type: String,
            default: "Checkout Order"
        },
        form: {
            type: Object,
            default: () => ({ name: "", address: "" })
        },
        loading: Boolean,
        error: String
    });

    const emit = defineEmits(["submit", "close"]);

    const localForm = ref({ ...props.form });

    watch(() => props.form, (newVal) => {
        localForm.value = { ...newVal };
    });

    function submitForm() {
        if (!localForm.value.name || !localForm.value.address) {
            emit("submit", { ...localForm.value, _error: "Please enter your name and address." });
            return;
        }
        emit("submit", { ...localForm.value });
    }
</script>

<template>
    <div v-if="visible">
        <div class="modal-overlay" @click="$emit('close')"></div>
        <div class="modal-container">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h5 class="modal-title">{{ title }}</h5>
                    <button class="modal-close" @click="$emit('close')">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <slot name="order-details"></slot>
                    <form @submit.prevent="submitForm">
                        <div class="form-group">
                            <label class="form-label">Name</label>
                            <input 
                                v-model="localForm.name" 
                                required 
                                class="form-input" 
                                placeholder="Enter your name" 
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Address</label>
                            <input 
                                v-model="localForm.address" 
                                required 
                                class="form-input" 
                                placeholder="Enter delivery address" 
                            />
                        </div>
                        <button :disabled="loading" type="submit" class="btn-submit">
                            {{ loading ? "Placing Order..." : "Place Order" }}
                        </button>
                        <div v-if="error" class="error-alert">
                            <i class="bi bi-exclamation-circle"></i>
                            {{ error }}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Modal Overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(26, 26, 26, 0.6);
    backdrop-filter: blur(4px);
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

/* Modal Container */
.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
    pointer-events: none;
}

.modal-content {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 520px;
    overflow: hidden;
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto;
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

/* Modal Header */
.modal-header {
    background: linear-gradient(135deg, var(--primary-bg) 0%, rgba(245, 228, 217, 0.8) 100%);
    border-bottom: 2px solid var(--primary-color);
    padding: 28px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.modal-header::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
    opacity: 0.5;
}

.modal-title {
    color: var(--primary-color);
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    letter-spacing: 0.5px;
}

.modal-close {
    background: none;
    border: none;
    font-size: 32px;
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.3s ease;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 0;
}

.modal-close:hover {
    color: var(--primary-dark);
    background: rgba(214, 69, 69, 0.08);
    transform: rotate(90deg);
}

/* Modal Body */
.modal-body {
    padding: 40px;
}

/* Form Styles */
.form-group {
    margin-bottom: 24px;
}

.form-label {
    display: block;
    color: var(--text-dark);
    font-weight: 500;
    margin-bottom: 10px;
    font-size: 13px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    opacity: 0.8;
}

.form-input {
    width: 100%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 14px 16px;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
    background: #fafafa;
    font-family: inherit;
}

.form-input::placeholder {
    color: #999;
    opacity: 0.7;
}

.form-input:focus {
    outline: none;
    border-color: var(--primary-color);
    background: white;
    box-shadow: 0 0 0 4px rgba(214, 69, 69, 0.08), inset 0 1px 0 rgba(0, 0, 0, 0.04);
}

/* Submit Button */
.btn-submit {
    width: 100%;
    background: linear-gradient(135deg, var(--primary-color) 0%, #c23636 100%);
    color: white;
    border: none;
    padding: 14px 24px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: 8px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    box-shadow: 0 4px 12px rgba(214, 69, 69, 0.2);
}

.btn-submit:hover:not(:disabled) {
    background: linear-gradient(135deg, #c23636 0%, #a82d2d 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(214, 69, 69, 0.3);
}

.btn-submit:active:not(:disabled) {
    transform: translateY(0);
}

.btn-submit:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
}

/* Error Alert */
.error-alert {
    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    color: #721c24;
    padding: 14px 16px;
    border-radius: 10px;
    margin-top: 16px;
    font-size: 14px;
    font-weight: 500;
    border-left: 4px solid #dc3545;
    display: flex;
    align-items: center;
    gap: 10px;
}

.error-alert i {
    font-size: 18px;
}

/* Responsive Design */
@media (max-width: 480px) {
    .modal-content {
        width: 95%;
        max-width: none;
    }

    .modal-body {
        padding: 30px 20px;
    }

    .modal-header {
        padding: 20px 24px;
    }

    .modal-title {
        font-size: 20px;
    }

    .form-group {
        margin-bottom: 18px;
    }

    .form-input {
        padding: 12px 14px;
        font-size: 16px;
    }
}
</style>