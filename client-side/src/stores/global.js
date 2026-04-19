import { defineStore } from 'pinia';
import { reactive } from 'vue';
import api from '../api';

export const useGlobalStore = defineStore('global', () => {
    let user = reactive({
        token: localStorage.getItem('token') || null,
        email: null,
        firstName: null,
        lastName: null,
        mobileNo: null,
        isAdmin: null,
        isLoading: false,
        authenticated: false
    });

    async function getUserDetails(token) {
        if (!token) {
            user.token = null;
            user.email = null;
            user.firstName = null;
            user.lastName = null;
            user.isAdmin = null;
            user.authenticated = false;
            localStorage.removeItem('token');
            return;
        }

        try {
            user.isLoading = true;
            const { data } = await api.get('/users/details', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            user.isLoading = false;
            user.token = token;
            user.email = data.user.email;
            user.firstName = data.user.firstName;
            user.lastName = data.user.lastName;
            user.mobileNo = data.user.mobileNo;
            user.isAdmin = data.user.isAdmin;
            user.authenticated = true;
            localStorage.setItem('token', token);
        } catch (error) {
            user.isLoading = false;
            user.token = null;
            user.email = null;
            user.firstName = null;
            user.lastName = null;
            user.isAdmin = null;
            user.authenticated = false;
            localStorage.removeItem('token');
            throw error;
        }
    }

    function logout() {
        user.token = null;
        user.email = null;
        user.isAdmin = null;
        user.authenticated = false;
        localStorage.removeItem('token');
    }

    // Initialize user from localStorage on app load
    const initToken = localStorage.getItem('token');
    if (initToken) {
        user.token = initToken;
    }

    return {
        user,
        getUserDetails,
        logout
    }
});