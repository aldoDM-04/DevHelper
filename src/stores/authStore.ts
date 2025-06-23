// src/stores/authStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as api from '@/services/apiService';
import type { User, LoginCredentials, RegisterCredentials } from '@/types';
import { useChatStore } from './chatStore';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(localStorage.getItem('authToken'));
    const isAuthenticated = computed(() => !!token.value && !!user.value);
    const isLoading = ref<boolean>(false);
    const authError = ref<string | null>(null);

    // Función para configurar el token y obtener datos del usuario
    async function setTokenAndFetchUser(newToken: string) {
        token.value = newToken;
        localStorage.setItem('authToken', newToken);
        api.setAuthHeader(newToken); // Configura el header para futuras peticiones

        try {
            // Aquí podrías tener un endpoint /api/users/me para obtener datos del usuario
            // Por ahora, simularemos que el email se puede extraer o se obtiene tras el login
            // Para una app real, el endpoint /me es la mejor práctica.
            // Decodificar el token para obtener el email (solo para UI, NUNCA para seguridad)
            const payload = JSON.parse(atob(newToken.split('.')[1]));
            const email = payload.sub; // 'sub' es el campo estándar para el sujeto (email)

            // Suponemos un ID de usuario ficticio, ya que /me no está implementado
            // En un caso real, /me devolvería {id, email, ...}
            user.value = { id: 'user-from-token', username: email, email };

            // Cargar los chats del usuario recién autenticado
            const chatStore = useChatStore();
            await chatStore.loadChats();

        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            await logout(); // Si falla, cerramos sesión
        }
    }

    async function login(credentials: LoginCredentials) {
        isLoading.value = true;
        authError.value = null;
        try {
            const response = await api.loginUser(credentials);
            await setTokenAndFetchUser(response.access_token);
        } catch (error: any) {
            authError.value = error.response?.data?.detail || "Error al iniciar sesión.";
            throw error; // Propaga el error para que el componente lo maneje
        } finally {
            isLoading.value = false;
        }
    }

    async function register(credentials: RegisterCredentials) {
        isLoading.value = true;
        authError.value = null;
        try {
            await api.registerUser(credentials);
            // Opcional: Iniciar sesión automáticamente después del registro
            await login({ email: credentials.email, password: credentials.password });
        } catch (error: any) {
            authError.value = error.response?.data?.detail || "Error en el registro.";
            throw error; // Propaga el error
        } finally {
            isLoading.value = false;
        }
    }

    async function logout() {
        const chatStore = useChatStore();

        user.value = null;
        token.value = null;
        localStorage.removeItem('authToken');
        api.setAuthHeader(null); // Limpia el header de autenticación
        chatStore.resetState(); // Limpia los datos de los chats
        console.log("Sesión cerrada y estado limpiado.");
    }

    // Comprobar la autenticación al cargar la app
    async function checkAuth() {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            console.log("Token encontrado en localStorage, intentando re-autenticar...");
            await setTokenAndFetchUser(storedToken);
        } else {
            console.log("No se encontró token, el usuario debe iniciar sesión.");
        }
    }

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        authError,
        login,
        register,
        logout,
        checkAuth
    };
});
