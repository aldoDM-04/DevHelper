<template>
  <div class="flex h-screen overflow-hidden">
    <ButtonSidebar />

    <ChatListSidebar />

    <ChatWindow />
  </div>
</template>

<script setup lang="ts">
import ButtonSidebar from '../components/ButtonSidebar.vue';
import ChatListSidebar from '../components/ChatListSidebar.vue';
import ChatWindow from '../components/ChatWindow.vue';

// No hay lógica en este componente por ahora, solo organización
</script>

<style scoped>
/* No debería necesitar estilos scoped si usas Tailwind para el layout */
</style>
