// Stores are defined using the defineStore() function and can be registered globally or locally within a component.
// Pinia Global Store for Bookstore SPA Authentication & State Management
// Holds user authentication, role, and provides methods for user/session management

import { defineStore } from 'pinia';
import { reactive } from 'vue';
import api from '../api';

// defineStore() creates a store. It has 2 arguments, the unique id of the store ('global') and the callback function that defines and returns the states and actions of the store.
// States and methods from a store can be accessed globally.
export const useGlobalStore = defineStore('global', () => {
    // 'user' state holds all authentication/session-related values
let user = reactive({
    token: localStorage.getItem('token'), // JWT token
    email: null, // User email
    isAdmin: null, // Admin flag for dashboard access
    isLoading: false // Loading indicator for async actions
});


async function getUserDetails(token){
    if(!token) {
        user.token = null;
        user.email = null;
        user.isAdmin = null;
        return;
    }
    user.isLoading = true;
    let { data } = await api.get('/users/details', {  
        headers: {  
            Authorization: `Bearer ${token}`  
        }  
    }); 
    user.isLoading = false;
    user.token = token;
    user.email = data.user.email;
    user.isAdmin = data.user.isAdmin;
}

function logout() {
    user.token = null;
    user.email = null;
    user.isAdmin = null;
    localStorage.removeItem('token');
}

return {
    user,
    getUserDetails,
    logout
}
});
