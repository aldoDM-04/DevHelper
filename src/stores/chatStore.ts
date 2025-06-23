// src/stores/chatStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Chat, Message } from '@/types';
import * as apiService from '@/services/apiService';

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([]);
  const activeChatId = ref<string | null>(null);
  const isLoadingChats = ref<boolean>(false);
  const isLoadingMessages = ref<boolean>(false);
  const currentMessageInput = ref<string>('');
  const error = ref<string | null>(null);

  const activeChat = computed((): Chat | undefined => {
    return activeChatId.value ? chats.value.find(chat => chat.id === activeChatId.value) : undefined;
  });

  const currentMessages = computed((): Message[] => {
    return activeChat.value?.messages || [];
  });

  const sortedChats = computed(() => chats.value);

  // --- NUEVO: Función para limpiar el estado ---
  function resetState() {
    chats.value = [];
    activeChatId.value = null;
    isLoadingChats.value = false;
    isLoadingMessages.value = false;
    currentMessageInput.value = '';
    error.value = null;
    console.log('[ChatStore] Estado reseteado.');
  }

  async function loadChats() {
    isLoadingChats.value = true;
    error.value = null;
    console.log('[ChatStore] loadChats: Iniciando carga de chats.');
    try {
      const fetchedChats = await apiService.fetchUserChats();
      chats.value = fetchedChats;
      console.log(`[ChatStore] loadChats: ${fetchedChats.length} chats cargados.`);

      if (fetchedChats.length > 0) {
        if (!activeChatId.value || !fetchedChats.some(c => c.id === activeChatId.value)) {
          await selectChat(fetchedChats[0].id);
        }
      } else {
        activeChatId.value = null;
      }
    } catch (err) {
      console.error('[ChatStore] loadChats: Error al cargar chats:', err);
      error.value = 'No se pudieron cargar los chats. ¿Has iniciado sesión?';
      resetState(); // Limpiar si hay error (ej. token expirado)
    } finally {
      isLoadingChats.value = false;
    }
  }

  async function selectChat(chatId: string) {
    const chatToSelect = chats.value.find(c => c.id === chatId);
    if (chatToSelect) {
        activeChatId.value = chatId;
    } else {
        console.warn(`[ChatStore] selectChat: Chat con ID ${chatId} no encontrado.`);
    }
  }

  async function handleCreateNewChat(firstMessage?: string) {
    isLoadingChats.value = true;
    error.value = null;
    try {
      const newChat = await apiService.createNewChat(firstMessage?.trim());
      chats.value.unshift(newChat);
      await selectChat(newChat.id);
      if (firstMessage?.trim()) {
        currentMessageInput.value = '';
      }
    } catch (err) {
      console.error('[ChatStore] handleCreateNewChat: Error al crear nuevo chat:', err);
      error.value = 'No se pudo crear el chat.';
    } finally {
      isLoadingChats.value = false;
    }
  }

  async function handleSendMessage() {
    if (!activeChatId.value || !currentMessageInput.value.trim()) {
        error.value = "Por favor, escribe un mensaje.";
        return;
    }
    const chatId = activeChatId.value;
    const messageText = currentMessageInput.value;

    currentMessageInput.value = '';
    isLoadingMessages.value = true;
    error.value = null;

    try {
      const updatedChat = await apiService.sendMessageToChat(chatId, messageText);
      const chatIdx = chats.value.findIndex(c => c.id === updatedChat.id);
      if (chatIdx !== -1) {
        chats.value[chatIdx] = updatedChat;
        const chatToMove = chats.value.splice(chatIdx, 1)[0];
        chats.value.unshift(chatToMove);
      } else {
        chats.value.unshift(updatedChat);
      }
    } catch (err) {
      console.error('[ChatStore] handleSendMessage: Error al enviar mensaje:', err);
      error.value = 'No se pudo enviar el mensaje.';
      currentMessageInput.value = messageText;
    } finally {
      isLoadingMessages.value = false;
    }
  }

  return {
    chats, activeChatId, isLoadingChats, isLoadingMessages, currentMessageInput, error,
    activeChat, currentMessages, sortedChats,
    loadChats, selectChat, handleCreateNewChat, handleSendMessage,
    resetState // Exportar la nueva función
  };
});
