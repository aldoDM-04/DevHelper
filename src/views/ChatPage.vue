<!-- views/Chat.vue (Actualizado) -->
<template>
    <!-- Si el usuario está autenticado, muestra la interfaz del chat -->
    <div v-if="isAuthenticated" class="flex h-screen overflow-hidden">
        <ButtonSidebar />
        <ChatListSidebar />
        <ChatWindow />
    </div>

    <!-- Si NO está autenticado, muestra un mensaje de bienvenida -->
    <div v-else class="flex h-screen overflow-hidden bg-gray-800 text-white">
        <ButtonSidebar /> <!-- Mantenemos la barra lateral para que pueda iniciar sesión -->
        <div class="flex-grow flex flex-col items-center justify-center text-center p-8">
            <h2 class="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300">
                Bienvenido a DevHelper
            </h2>
            <p class="text-xl text-gray-400">
                Por favor, inicia sesión para comenzar a chatear.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import ButtonSidebar from '../components/ButtonSidebar.vue';
import ChatListSidebar from '../components/ChatListSidebar.vue';
import ChatWindow from '../components/ChatWindow.vue';
import { useAuthStore } from '@/stores/authStore'; // <-- Importa el store

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Al montar esta vista, intenta comprobar si hay un token guardado.
// Esto es clave para la persistencia de la sesión.
onMounted(() => {
    authStore.checkAuth();
});
</script>
