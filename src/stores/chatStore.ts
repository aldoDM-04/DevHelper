// src/stores/chatStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue'; // Asegúrate que nextTick NO esté importado aquí si no se usa
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
    if (!activeChatId.value) {
      // console.log('[ChatStore] activeChat: activeChatId is null.');
      return undefined;
    }
    const found = chats.value.find(chat => chat.id === activeChatId.value);
    // console.log(`[ChatStore] activeChat: for ID ${activeChatId.value}, found:`, found ? found.id : 'undefined', 'with messages:', found?.messages?.length);
    return found;
  });

  const currentMessages = computed((): Message[] => {
    // console.log('[ChatStore] currentMessages computed. Active chat messages:', activeChat.value?.messages?.length);
    return activeChat.value?.messages || [];
  });

  const sortedChats = computed(() => chats.value);

  async function loadChats() {
    isLoadingChats.value = true;
    error.value = null;
    console.log('[ChatStore] loadChats: Iniciando carga de chats.');
    try {
      const fetchedChats = await apiService.fetchUserChats();
      chats.value = fetchedChats;
      console.log(`[ChatStore] loadChats: ${fetchedChats.length} chats cargados.`, fetchedChats);

      if (fetchedChats.length > 0) {
        // Si no hay un chat activo O el chat activo actual ya no existe en la nueva lista
        if (!activeChatId.value || !fetchedChats.some(c => c.id === activeChatId.value)) {
            console.log('[ChatStore] loadChats: Seleccionando primer chat de la lista como activo:', fetchedChats[0].id);
            await selectChat(fetchedChats[0].id); // Selecciona el más reciente (ya vienen ordenados)
        } else {
            console.log('[ChatStore] loadChats: Chat activo actual sigue siendo válido:', activeChatId.value);
        }
      } else {
        console.log('[ChatStore] loadChats: No se cargaron chats. Limpiando activeChatId.');
        activeChatId.value = null;
      }
    } catch (err) {
      console.error('[ChatStore] loadChats: Error al cargar chats:', err);
      error.value = 'No se pudieron cargar los chats.';
      chats.value = [];
      activeChatId.value = null;
    } finally {
      isLoadingChats.value = false;
    }
  }

  async function selectChat(chatId: string) {
    console.log(`[ChatStore] selectChat: Intentando seleccionar chat ID: ${chatId}`);
    // Verificar si el chat realmente existe en nuestra lista local
    const chatToSelect = chats.value.find(c => c.id === chatId);
    if (chatToSelect) {
        activeChatId.value = chatId;
        console.log(`[ChatStore] selectChat: activeChatId establecido a: ${activeChatId.value}. Chat title: ${chatToSelect.title}`);
    } else {
        console.warn(`[ChatStore] selectChat: Chat con ID ${chatId} no encontrado en la lista local. No se seleccionará.`);
        // Opcional: podrías intentar recargar si sospechas que la lista está desactualizada.
        // await loadChats(); // Cuidado con bucles infinitos.
    }
  }

  async function handleCreateNewChat(firstMessage?: string) {
    isLoadingChats.value = true; // O un loader específico para 'creando chat'
    error.value = null;
    console.log('[ChatStore] handleCreateNewChat: Creando nuevo chat.');
    try {
      const newChat = await apiService.createNewChat(firstMessage?.trim());
      console.log('[ChatStore] handleCreateNewChat: Nuevo chat creado en API:', newChat);
      chats.value.unshift(newChat); // Añadir al principio (asumiendo orden por más reciente)
      await selectChat(newChat.id); // Seleccionar el nuevo chat
      if (firstMessage?.trim()) {
        currentMessageInput.value = ''; // Limpiar input si se usó para el primer mensaje
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
    console.log(`[ChatStore] handleSendMessage: Enviando mensaje "${messageText}" al chat ID: ${chatId}`);

    // Limpiar input inmediatamente (UI optimista)
    currentMessageInput.value = '';
    isLoadingMessages.value = true;
    error.value = null;

    try {
      const updatedChat = await apiService.sendMessageToChat(chatId, messageText);
      console.log('[ChatStore] handleSendMessage: Chat actualizado recibido de API:', updatedChat);

      const chatIdx = chats.value.findIndex(c => c.id === updatedChat.id);
      if (chatIdx !== -1) {
        chats.value[chatIdx] = updatedChat; // Actualizar el chat con los nuevos mensajes
        // Mover el chat actualizado al principio de la lista `chats`
        const chatToMove = chats.value.splice(chatIdx, 1)[0];
        chats.value.unshift(chatToMove);
        console.log('[ChatStore] handleSendMessage: Chat actualizado y movido al principio.');
      } else {
        // Esto no debería pasar si el chat activo existe
        console.warn('[ChatStore] handleSendMessage: Chat actualizado no encontrado en la lista local, añadiendo al principio.');
        chats.value.unshift(updatedChat);
      }
      // No es necesario llamar a selectChat explícitamente si activeChatId no cambió,
      // ya que las propiedades computadas (activeChat, currentMessages) se recalcularán.
    } catch (err) {
      console.error('[ChatStore] handleSendMessage: Error al enviar mensaje:', err);
      error.value = 'No se pudo enviar el mensaje.';
      currentMessageInput.value = messageText; // Restaurar input para que el usuario no pierda el texto
    } finally {
      isLoadingMessages.value = false;
    }
  }

  return {
    chats, activeChatId, isLoadingChats, isLoadingMessages, currentMessageInput, error,
    activeChat, currentMessages, sortedChats,
    loadChats, selectChat, handleCreateNewChat, handleSendMessage,
  };
});
