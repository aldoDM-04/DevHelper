<template>
  <div class="w-64 flex flex-col h-screen chat-sidebar-main">
    <div
      class="flex items-center px-4 py-4 border-b chat-sidebar-header"
    >
      <img
        src="/src/assets/logo.png"
        alt="DevHelper Logo"
        class="w-9 h-9 mr-2"
      />
      <span class="text-xl font-bold chat-sidebar-header-title">DevHelper</span>
    </div>

    <div class="flex-grow overflow-y-auto px-2 pt-3">
      <button
        @click="store.handleCreateNewChat()"
        class="px-4 py-2.5 rounded-lg w-full text-left font-semibold shadow-md mb-4 hover:rounded-md hover:scale-105 flex items-center justify-center text-sm chat-sidebar-new-chat-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-5 h-5 mr-2"
        >
          <path
            d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
          />
        </svg>
        Nuevo Chat
      </button>

      <div v-if="store.isLoadingChats && store.chats.length === 0" class="text-center py-4 text-sm chat-sidebar-placeholder-text">
        Cargando chats...
      </div>
      <div
        v-else-if="store.error && store.chats.length === 0"
        class="text-center py-4 px-2 text-sm chat-sidebar-error-text"
      >
        {{ store.error }}
      </div>
      <div
        v-else-if="store.sortedChats.length === 0 && !store.isLoadingChats"
        class="text-center py-4 px-2 text-sm chat-sidebar-placeholder-text"
      >
        No hay chats. ¡Crea uno nuevo para comenzar!
      </div>
      <div v-else class="space-y-1 px-2">
        <div
          v-for="chat in store.sortedChats"
          :key="chat.id"
          @click="store.selectChat(chat.id)"
          class="px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ease-in-out text-sm truncate chat-list-item"
          :class="{
            'chat-list-item-active': store.activeChatId === chat.id
          }"
          :title="chat.title"
        >
          {{ chat.title || `Chat ${chat.id}` }}
        </div>
      </div>
    </div>

    <div
      class="flex items-center px-4 py-3 mt-auto border-t chat-sidebar-footer"
    >
      <button
        class="p-2 rounded-md flex items-center justify-center mr-3 transition-colors cursor-pointer chat-sidebar-info-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5"
        >
          <path
            fill-rule="evenodd"
            d="M11.47 3.827c-.379-1.024-1.75-1.024-2.13 0l-.603 1.624a1.925 1.925 0 01-1.213 1.213l-1.624.603c-1.024.379-1.024 1.75 0 2.13l1.624.603a1.925 1.925 0 011.213 1.213l.603 1.624c.379 1.024 1.75 1.024 2.13 0l.603-1.624a1.925 1.925 0 011.213-1.213l1.624-.603c1.024-.379 1.024-1.75 0-2.13l-1.624-.603a1.925 1.925 0 01-1.213-1.213l-.603-1.624z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <span class="text-sm font-semibold chat-sidebar-info-text">DevHelper Info</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useChatStore } from '@/stores/chatStore';

const store = useChatStore();

onMounted(() => {
  store.loadChats();
});
</script>

<style scoped>
/* Estos estilos scoped del scrollbar se movieron a main.css */
</style>
