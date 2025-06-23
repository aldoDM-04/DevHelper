// src/stores/themeStore.ts
import { defineStore } from 'pinia';
import { ref, watch, onMounted } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // Inicializa el tema a null o undefined. Esto evita aplicar un tema
  // antes de que el componente principal tenga la oportunidad de establecerlo,
  // o antes de leer localStorage.
  const currentTheme = ref<string | null>(null);

  // Función para establecer el tema
  function setTheme(theme: 'light' | 'dark') {
    currentTheme.value = theme;
  }

  // Función para alternar el tema
  function toggleTheme() {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  }

  // Observa cambios en currentTheme y actualiza el DOM y localStorage
  watch(currentTheme, (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      // Solo removemos si el tema es 'light' o si se establece a null/undefined
      document.documentElement.classList.remove('dark');
    }
    // Guarda en localStorage solo si el tema no es nulo
    if (newTheme !== null) {
      localStorage.setItem('theme', newTheme);
    } else {
      localStorage.removeItem('theme'); // Limpiar si no hay tema definido (e.g. al inicio)
    }
  }); // Sin 'immediate: true' aquí. Lo manejaremos en onMounted.

  // Al montar el store (cuando se usa por primera vez), cargar la preferencia
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      currentTheme.value = savedTheme;
    } else {
      // Si no hay nada guardado o es inválido, por defecto 'light'
      currentTheme.value = 'light';
    }
    // La clase 'dark' se añadirá o quitará automáticamente por el watcher
  });

  return {
    currentTheme,
    toggleTheme,
    setTheme,
  };
});
