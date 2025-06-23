<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';

// Props y Emits
const props = defineProps<{ isOpen: boolean; }>();
const emit = defineEmits(['close']);

// Store de autenticación
const authStore = useAuthStore();

// Estado del formulario
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoginMode = ref(true);

// Estado de la UI
const errorMessage = ref<string | null>(null);
const isLoading = computed(() => authStore.isLoading);

// Limpiar el formulario y errores cuando se cierra el modal
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    email.value = '';
    password.value = '';
    showPassword.value = false;
    isLoginMode.value = true;
    errorMessage.value = null;
    authStore.authError = null; // Limpiar error del store también
  }
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Cambiar entre modo login y registro
const toggleMode = () => {
    isLoginMode.value = !isLoginMode.value;
    errorMessage.value = null;
    authStore.authError = null;
}

const closeModal = () => {
  emit('close');
};

const handleSubmit = async () => {
  errorMessage.value = null;
  authStore.authError = null;

  try {
    if (isLoginMode.value) {
      await authStore.login({ email: email.value, password: password.value });
    } else {
      await authStore.register({ email: email.value, password: password.value });
    }
    // Si tiene éxito, el modal se cerrará desde el componente padre
    closeModal();
  } catch (error) {
    // El error ya está en authStore.authError, lo mostramos en el modal
    errorMessage.value = authStore.authError;
    console.error("Fallo en la autenticación:", error);
  }
};
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray bg-opacity-70 p-4"
      @click.self="closeModal"
    >
      <div
        class="relative bg-gray-900 text-white rounded-xl shadow-2xl p-8
               max-w-md w-full
               border border-purple-800"
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          aria-label="Cerrar"
        >
          &times;
        </button>

        <h2 class="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 mb-4">
          {{ isLoginMode ? 'Iniciar Sesión' : 'Registrarse' }}
        </h2>

        <!-- Mensaje de Error -->
        <div v-if="errorMessage" class="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm text-center mb-4">
            {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <input
            v-model="email"
            type="email"
            placeholder="Correo Electrónico"
            class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500"
            required
            autocomplete="username"
          />

          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Contraseña"
              class="w-full p-3 pr-10 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500"
              required
              autocomplete="current-password"
            />
            <!-- Ícono para mostrar/ocultar contraseña -->
             <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200"
              aria-label="Alternar visibilidad de contraseña"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M1.5 12C3.5 7.5 7.5 4.5 12 4.5s8.5 3 10.5 7.5c-2 4.5-6 7.5-10.5 7.5S3.5 16.5 1.5 12zM12 16a4 4 0 100-8 4 4 0 000 8z"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M1.5 12C3.5 7.5 7.5 4.5 12 4.5s8.5 3 10.5 7.5c-2 4.5-6 7.5-10.5 7.5S3.5 16.5 1.5 12zM12 16a4 4 0 100-8 4 4 0 000 8z"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </button>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-6 rounded-full font-bold text-lg text-white
                   bg-gradient-to-r from-purple-700 to-blue-500
                   hover:from-purple-800 hover:to-blue-600
                   transition-all duration-300 transform hover:scale-114
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Procesando...</span>
            <span v-else>{{ isLoginMode ? 'Iniciar Sesión' : 'Registrarse' }}</span>
          </button>
        </form>

        <button
          @click="toggleMode"
          class="mt-6 text-sm w-full text-center text-gray-400 hover:text-purple-400"
        >
          {{ isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
