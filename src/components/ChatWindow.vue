<template>
  <div class="flex-grow flex flex-col h-screen chat-window-main">
    <div
      class="p-4 border-b shadow-sm flex items-center min-h-[65px] chat-header"
    >
      <div class="flex-shrink-0">
        <h2
          class="text-lg font-semibold truncate max-w-md chat-header-title"
          :title="store.activeChat?.title"
        >
          <template v-if="store.activeChatId && store.activeChat">
            {{ store.activeChat.title }}
          </template>
          <template v-else-if="store.activeChatId && !store.activeChat && store.isLoadingChats">
            Cargando...
          </template>
          <template v-else>
            Selecciona o crea un chat
          </template>
        </h2>
        <p v-if="store.activeChat" class="text-xs chat-header-messages-count">
          {{ store.currentMessages.length }} mensajes
        </p>
      </div>

      <div class="flex-grow flex justify-center">
        <div class="flex items-center space-x-2 chat-theme-button-container">
          <button
            @click="themeStore.setTheme('light')"
            class="p-1 rounded-md transition-colors cursor-pointer chat-theme-button-light-hover"
            :class="{ 'chat-theme-button-light-active': themeStore.currentTheme === 'light' }"
            aria-label="Alternar Modo Claro"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.364 18.364l.707-.707M7.05 6.343l-.707-.707M12 16a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          </button>
          <button
            @click="themeStore.setTheme('dark')"
            class="p-1 rounded-md transition-colors cursor-pointer chat-theme-button-light-hover"
            :class="{ 'chat-theme-button-dark-active': themeStore.currentTheme === 'dark' }"
            aria-label="Alternar Modo Oscuro"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.731 12.917A8.692 8.692 0 008.691 11.08c-.324 0-.65.022-.976.066A8.693 8.693 0 0121.73 20.083a8.693 8.693 0 00.001-7.166z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex-shrink-0 ml-auto flex items-center space-x-3">
        <button
          class="p-1.5 rounded-md transition-colors cursor-pointer chat-options-button"
          aria-label="Opciones"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 6h9.75M10.5 12h9.75m-9.75 6h9.75M3.75 6H7.5m-3.75 6h3.75m-3.75 6h3.75"
            />
          </svg>
        </button>
        <img
          src="/src/assets/userIcon.png"
          alt="Avatar de Usuario"
          class="w-8 h-8 rounded-full cursor-pointer"
        />
      </div>
    </div>

    <div
      ref="messagesContainerRef"
      class="flex-grow p-4 sm:p-6 overflow-y-auto flex flex-col gap-y-4"
    >
      <div
        v-if="!store.activeChatId && !store.isLoadingChats"
        class="flex flex-col items-center justify-center h-full text-center chat-messages-container-placeholder"
      >
        <img src="/src/assets/logo.png" alt="DevHelper Logo" class="w-16 h-16 mb-4 opacity-70" />
        <p class="text-lg font-medium">Bienvenido a DevHelper</p>
        <p class="text-sm">Selecciona un chat de la izquierda o crea uno nuevo para comenzar.</p>
      </div>

      <div
        v-else-if="store.isLoadingChats && !store.activeChat"
        class="flex items-center justify-center h-full chat-messages-container-placeholder"
      >
        Cargando chats...
      </div>

      <div
        v-else-if="store.activeChat && store.currentMessages.length === 0 && !store.isLoadingMessages"
        class="flex flex-col items-center justify-center h-full text-center chat-messages-container-placeholder"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12 mb-3 opacity-50"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.862 8.25-8.625 8.25S3.75 16.556 3.75 12c0-4.556 3.862-8.25 8.625-8.25S21 7.444 21 12z"
          />
        </svg>
        <p class="text-base">Este chat está vacío.</p>
        <p class="text-sm">Envía un mensaje para iniciar la conversación.</p>
      </div>

      <template v-else-if="store.activeChat && store.currentMessages.length > 0">
        <div
          v-for="message in store.currentMessages"
          :key="message.id"
          :class="[
            'flex items-end gap-x-2 max-w-lg xl:max-w-xl',
            message.sender === 'user' ? 'self-end flex-row-reverse ml-auto' : 'self-start mr-auto'
          ]"
        >
          <img
            :src="message.sender === 'user' ? '/src/assets/userIcon.png' : '/src/assets/tutorIcon.png'"
            :alt="message.sender === 'user' ? 'User Icon' : 'Tutor Icon'"
            class="w-7 h-7 rounded-full flex-shrink-0 mb-0.5"
            :class="{ 'order-2': message.sender === 'user' }"
          />
          <div
            :class="[
              'rounded-xl p-3 text-sm leading-relaxed shadow-sm',
              message.sender === 'user'
                ? 'bg-purple-600 text-white rounded-br-none'
                : 'rounded-bl-none chat-message-tutor-bubble'
            ]"
          >
            <div
              v-if="message.sender === 'tutor'"
              class="flex items-center mb-1 text-xs"
              :class="[message.sender === 'user' ? 'justify-end' : '']"
            >
              <span class="font-semibold mr-2 chat-message-tutor-name" v-if="message.sender === 'tutor'"
                >DevHelper</span
              >
            </div>
            <p style="white-space: pre-wrap;">{{ message.text }}</p>
            <div
              class="text-xs mt-1.5 flex justify-between items-center"
              :class="
                message.sender === 'user'
                  ? 'text-purple-200 text-right'
                  : 'text-left chat-message-timestamp-tutor'
              "
            >
              {{ formatTimestamp(message.timestamp) }}

              <div v-if="message.sender === 'tutor'" class="flex items-center space-x-1 ml-auto">
                <button
                  @click="toggleReaction(message.id, 'like')"
                  class="p-0.5 rounded-full transition-colors"
                  :class="{ 'bg-blue-500 text-white': message.selectedReaction === 'like' }"
                  aria-label="Me gusta"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-3 h-3"
                  >
                    <polygon points="7 9 11 2 14 2 13 9 22 9 20 22 7 22 7 9"></polygon>
                    <rect x="2" y="9" width="5" height="13"></rect>
                  </svg>
                </button>
                <button
                  @click="toggleReaction(message.id, 'dislike')"
                  class="p-0.5 rounded-full transition-colors"
                  :class="{ 'bg-red-500 text-white': message.selectedReaction === 'dislike' }"
                  aria-label="No me gusta"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-3 h-3"
                  >
                    <polygon points="17 15 13 22 10 22 11 15 2 15 4 2 17 2 17 15" />
                    <rect x="17" y="2" width="5" height="13" />
                  </svg>

                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div
        v-if="store.isLoadingMessages && store.activeChatId"
        class="self-start flex items-end gap-x-2 max-w-lg xl:max-w-xl mr-auto"
      >
        <img
          src="/src/assets/tutorIcon.png"
          alt="Tutor Icon"
          class="w-7 h-7 rounded-full flex-shrink-0 mb-0.5"
        />
        <div
          class="rounded-xl rounded-bl-none p-3 text-sm leading-relaxed shadow-sm chat-message-tutor-bubble"
        >
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div
        v-else-if="store.activeChatId && !store.isLoadingChats && !store.activeChat"
        class="text-center py-10 chat-messages-container-placeholder"
      >
        Chat activo (ID: {{ store.activeChatId }}) no encontrado en la lista. Esto no debería ocurrir.
      </div>
    </div>

    <div
      v-if="store.activeChatId"
      class="p-3 sm:p-4 border-t flex items-center space-x-3 chat-input-container"
    >
      <div class="relative flex-grow">
        <textarea
          v-model="store.currentMessageInput"
          @keydown.enter.exact.prevent="submitMessage"
          @input="adjustTextareaHeight"
          ref="textareaRef"
          rows="1"
          placeholder="Escribe tu mensaje a DevHelper..."
          class="w-full pl-4 pr-12 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none overflow-y-hidden chat-textarea"
          style="min-height: 44px; max-height: 150px;"
          :disabled="store.isLoadingMessages"
        ></textarea>
      </div>
      <button
        @click="submitMessage"
        :disabled="!store.currentMessageInput.trim() || store.isLoadingMessages"
        class="text-white rounded-xl w-10 h-10 flex items-center justify-center shadow-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0 chat-send-button"
        aria-label="Enviar mensaje"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-5 h-5"
        >
          <path
            d="M3.105 3.105a.5.5 0 01.815-.014l12.53 10.611a.5.5 0 01-.013.816L3.92 20.071a.5.5 0 01-.815-.801L15.99 11H3.001a.5.5 0 01-.478-.36Z"
          />
        </svg>
      </button>
    </div>
    <div
      v-else
      class="p-3 sm:p-4 border-t h-[69px] flex items-center justify-center text-sm chat-no-active-message-area"
    >
      Selecciona un chat para enviar mensajes.
    </div>

    <div
      class="text-xs text-center py-2 border-t chat-footer-disclaimer"
    >
      DevHelper puede cometer errores. Considera verificar la información importante.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { useChatStore } from '@/stores/chatStore';
import { useThemeStore } from '@/stores/themeStore';

const store = useChatStore();
const themeStore = useThemeStore();

const messagesContainerRef = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

function formatTimestamp(isoString?: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch (_error) {
    return 'Hora inválida';
  }
}

async function submitMessage() {
  if (!store.currentMessageInput.trim() || store.isLoadingMessages) return;
  await store.handleSendMessage();
  await nextTick();
  adjustTextareaHeight();
}

const scrollToBottom = async (behavior: ScrollBehavior = 'smooth') => {
  await nextTick();
  if (messagesContainerRef.value) {
    messagesContainerRef.value.scrollTo({
      top: messagesContainerRef.value.scrollHeight,
      behavior: behavior
    });
  }
};

watch(
  () => store.currentMessages.map(m => m.id).join(','),
  () => {
    scrollToBottom();
  }
);



// Agregado: Función para manejar la reacción de Like/Dislike
const toggleReaction = (messageId: string, reaction: 'like' | 'dislike') => {
  const message = store.currentMessages.find(m => m.id === messageId);
  if (message) {
    if (!message.selectedReaction) {
      // Si no hay reacción seleccionada, selecciona la actual
      message.selectedReaction = reaction;
    } else if (message.selectedReaction === reaction) {
      // Si la reacción ya está seleccionada, deseléccionala
      message.selectedReaction = undefined;
    } else {
      // Si la otra reacción está seleccionada, cambia a la actual
      message.selectedReaction = reaction;
    }
  }
};

watch(
  () => store.activeChatId,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      store.currentMessageInput = '';
      // Cuando el chat activo cambia, reinicia las reacciones de los mensajes
      store.currentMessages.forEach(message => {
        if (message.selectedReaction) {
          message.selectedReaction = undefined;
        }
      });
      nextTick(() => {
        adjustTextareaHeight();
        scrollToBottom('auto');
      });
    } else if (!newId) {
      store.currentMessageInput = '';
      nextTick(() => adjustTextareaHeight());
    }
  }
);



const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    const scrollHeight = textareaRef.value.scrollHeight;
    const maxHeight = 150;
    textareaRef.value.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    textareaRef.value.style.overflowY = scrollHeight > maxHeight ? 'scroll' : 'hidden';
  }
};

watch(
  () => store.currentMessageInput,
  () => {
    nextTick(() => adjustTextareaHeight());
  }
);

onMounted(() => {
  nextTick(() => adjustTextareaHeight());
  if (store.activeChatId && store.currentMessages.length > 0) {
    scrollToBottom('auto');
  }
});
</script>

<style scoped>
/* Estos estilos scoped del scrollbar y typing-indicator se movieron a main.css */

/* Estilos adicionales para los botones de Like/Dislike */
.chat-message-tutor-bubble .text-xs {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-message-tutor-bubble .text-xs .ml-auto {
  margin-left: auto; /* Asegura que los botones se peguen a la derecha */
}

/* Colores para los iconos, podrías ajustarlos según tu paleta */
.bg-blue-500 {
  background-color: #3b82f6; /* Tailwind blue-500 */
}

.bg-red-500 {
  background-color: #ef4444; /* Tailwind red-500 */
}
</style>
