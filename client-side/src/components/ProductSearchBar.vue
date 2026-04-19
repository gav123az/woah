<script setup>
    const props = defineProps({
        modelValue: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: 'Search products...'
        }
    });
    const emit = defineEmits(['update:modelValue']);
    function onInput(event) {
        emit('update:modelValue', event.target.value);
    }
</script>

<template>
    <input
        type="text"
        class="form-control"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
        aria-label="Search"
    />
</template>