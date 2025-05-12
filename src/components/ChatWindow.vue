<template>
  <div class="flex-grow bg-white flex flex-col h-screen">
    <div class="p-4 border-b border-gray-200 bg-gray-50 shadow-sm flex items-center min-h-[65px]">
      <div class="flex-shrink-0">
        <h2 class="text-lg font-semibold text-gray-800 truncate max-w-md" :title="store.activeChat?.title">
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
        <p v-if="store.activeChat" class="text-xs text-gray-500">
          {{ store.currentMessages.length }} mensajes
        </p>
      </div>
      <div class="flex-grow"></div>
      <div class="flex-shrink-0 ml-auto flex items-center space-x-3">
        <button class="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors" aria-label="Opciones">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 12h9.75m-9.75 6h9.75M3.75 6H7.5m-3.75 6h3.75m-3.75 6h3.75" /></svg>
        </button>
        <img src="/src/assets/userIcon.png" alt="Avatar de Usuario" class="w-8 h-8 rounded-full cursor-pointer"/>
      </div>
    </div>

    <div ref="messagesContainerRef" class="flex-grow p-4 sm:p-6 overflow-y-auto flex flex-col gap-y-4">
      <div v-if="!store.activeChatId && !store.isLoadingChats" class="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <img src="/src/assets/logo.png" alt="DevHelper Logo" class="w-16 h-16 mb-4 opacity-70" />
        <p class="text-lg font-medium">Bienvenido a DevHelper</p>
        <p class="text-sm">Selecciona un chat de la izquierda o crea uno nuevo para comenzar.</p>
      </div>

      <div v-else-if="store.isLoadingChats && !store.activeChat" class="flex items-center justify-center h-full text-gray-500">
        Cargando chats...
      </div>

      <div v-else-if="store.activeChat && store.currentMessages.length === 0 && !store.isLoadingMessages" class="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mb-3 opacity-50">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.862 8.25-8.625 8.25S3.75 16.556 3.75 12c0-4.556 3.862-8.25 8.625-8.25S21 7.444 21 12z" />
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
            :class="{'order-2': message.sender === 'user'}"
          />
          <div
            :class="[
              'rounded-xl p-3 text-sm leading-relaxed shadow-sm',
              message.sender === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
            ]"
          >
            <div
              v-if="message.sender === 'tutor'"
              class="flex items-center mb-1 text-xs"
               :class="[ message.sender === 'user' ? 'justify-end' : '']"
            >
              <span class="font-semibold text-purple-700 mr-2" v-if="message.sender === 'tutor'">DevHelper</span>
            </div>
            <p style="white-space: pre-wrap;">{{ message.text }}</p>
             <div class="text-xs mt-1.5" :class="message.sender === 'user' ? 'text-purple-200 text-right' : 'text-gray-500 text-left'">
                {{ formatTimestamp(message.timestamp) }}
            </div>
          </div>
        </div>
      </template>

      <div v-if="store.isLoadingMessages && store.activeChatId" class="self-start flex items-end gap-x-2 max-w-lg xl:max-w-xl mr-auto">
        <img src="/src/assets/tutorIcon.png" alt="Tutor Icon" class="w-7 h-7 rounded-full flex-shrink-0 mb-0.5" />
        <div class="bg-gray-100 text-gray-800 rounded-xl rounded-bl-none p-3 text-sm leading-relaxed shadow-sm">
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div v-else-if="store.activeChatId && !store.isLoadingChats && !store.activeChat" class="text-center py-10 text-gray-400">
         Chat activo (ID: {{ store.activeChatId }}) no encontrado en la lista. Esto no debería ocurrir.
      </div>

    </div>

    <div v-if="store.activeChatId" class="p-3 sm:p-4 border-t border-gray-200 bg-white flex items-center space-x-3">
      <div class="relative flex-grow">
        <textarea
          v-model="store.currentMessageInput"
          @keydown.enter.exact.prevent="submitMessage"
          @input="adjustTextareaHeight"
          ref="textareaRef"
          rows="1"
          placeholder="Escribe tu mensaje a DevHelper..."
          class="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none overflow-y-hidden"
          style="min-height: 44px; max-height: 150px;"
          :disabled="store.isLoadingMessages"
        ></textarea>
      </div>
      <button
        @click="submitMessage"
        :disabled="!store.currentMessageInput.trim() || store.isLoadingMessages"
        class="bg-purple-600 text-white rounded-xl w-10 h-10 flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
        aria-label="Enviar mensaje"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M3.105 3.105a.5.5 0 01.815-.014l12.53 10.611a.5.5 0 01-.013.816L3.92 20.071a.5.5 0 01-.815-.801L15.99 11H3.001a.5.5 0 01-.478-.36Z" /></svg>
      </button>
    </div>
    <div v-else class="p-3 sm:p-4 border-t h-[69px] flex items-center justify-center text-gray-400 text-sm">
        Selecciona un chat para enviar mensajes.
    </div>


    <div class="text-xs text-gray-400 text-center py-2 border-t border-gray-100 bg-white">
      DevHelper puede cometer errores. Considera verificar la información importante.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { useChatStore } from '@/stores/chatStore';

const store = useChatStore();
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return 'Hora inválida';
  }
}

async function submitMessage() {
  if (!store.currentMessageInput.trim() || store.isLoadingMessages) return;
  await store.handleSendMessage(); // El store limpia el input
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

// Scroll al cambiar mensajes (más robusto)
watch(() => store.currentMessages.map(m => m.id).join(','), () => { // Observa los IDs de los mensajes
    scrollToBottom();
});


// Scroll al cambiar de chat activo
watch(() => store.activeChatId, (newId, oldId) => {
  if(newId && newId !== oldId) {
    store.currentMessageInput = '';
    nextTick(() => {
        adjustTextareaHeight();
        scrollToBottom('auto');
    });
  } else if (!newId) {
    store.currentMessageInput = '';
    nextTick(() => adjustTextareaHeight());
  }
});

const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    const scrollHeight = textareaRef.value.scrollHeight;
    const maxHeight = 150;
    textareaRef.value.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    textareaRef.value.style.overflowY = scrollHeight > maxHeight ? 'scroll' : 'hidden';
  }
};

watch(() => store.currentMessageInput, () => {
  nextTick(() => adjustTextareaHeight());
});

onMounted(() => {
  // No llamar a loadChats aquí si ChatListSidebar ya lo hace.
  // Asegurar que el textarea se ajuste al inicio
  nextTick(() => adjustTextareaHeight());
  // Scroll inicial si ya hay un chat activo con mensajes
  if (store.activeChatId && store.currentMessages.length > 0) {
      scrollToBottom('auto');
  }
});
</script>

<style scoped>
/* ... (estilos como los tenías, incluyendo .typing-indicator) ... */
.overflow-y-auto::-webkit-scrollbar { width: 8px; }
.overflow-y-auto::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

.typing-indicator span {
  height: 8px; width: 8px; background-color: #9ca3af;
  border-radius: 50%; display: inline-block; margin: 0 1px;
  animation: bounce 1.2s infinite ease-in-out;
}
.typing-indicator span:nth-child(2) { animation-delay: -0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: -0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}
</style>
