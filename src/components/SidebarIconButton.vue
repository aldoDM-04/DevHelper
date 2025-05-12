<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  svgPath: string; // La cadena con los datos 'd' del path SVG
  label?: string; // Etiqueta opcional para accesibilidad/tooltip
  initialColorClass?: string; // Clase de Tailwind para el color inicial (ej: 'text-gray-500')
  hoverColorClass?: string; // Clase de Tailwind para el color en hover (ej: 'text-blue-600')
  sizeClass?: string; // Clase de Tailwind para el tamaño del ícono (ej: 'w-6 h-6')
  paddingClass?: string; // Clase de Tailwind para el padding alrededor del ícono (ej: 'p-2')
  initialShapeClass?: string; // Clase de Tailwind para la forma inicial (ej: 'rounded-full')
  hoverShapeClass?: string; // Clase de Tailwind para la forma en hover (ej: 'rounded-md')
}>();

// Clases por defecto si no se proveen props
const initialColor = computed(() => props.initialColorClass || 'text-gray-500');
const hoverColor = computed(() => props.hoverColorClass || 'text-blue-600'); // Color de ejemplo
const iconSize = computed(() => props.sizeClass || 'w-6 h-6');
const iconPadding = computed(() => props.paddingClass || 'p-2'); // Espacio alrededor del ícono
const initialShape = computed(() => props.initialShapeClass || 'rounded-full'); // Forma inicial (circular)
const hoverShape = computed(() => props.hoverShapeClass || 'rounded-md'); // Forma en hover (cuadrado redondeado)


// Clases combinadas para el contenedor para el efecto hover
const containerClasses = computed(() => [
  'group', // Habilita el uso de group-hover en los hijos
  iconPadding.value,
  'flex', 'items-center', 'justify-center', // Centra el SVG
  initialShape.value,
  'transition-all', 'duration-200', // Transición suave para el efecto
  'hover:bg-white', // Fondo blanco en hover
  `hover:${hoverShape.value}`, // Cambia la forma en hover
  'hover:scale-110', // Escala ligeramente en hover
  'cursor-pointer' // Indica que es interactivo
]);

 // Clases para el ícono SVG
 const svgClasses = computed(() => [
   iconSize.value,
   initialColor.value, // Color inicial
   `group-hover:${hoverColor.value}`, // Cambia el color del ícono en hover (gracias a group-hover)
   'transition-colors', 'duration-200' // Transición suave para el cambio de color del ícono
 ]);

</script>

<template>
  <button :class="containerClasses" :aria-label="label">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      :class="svgClasses"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        :d="svgPath"
        clip-rule="evenodd"
      />
    </svg>
  </button>
</template>

<style scoped>
/* No necesitas estilos scoped si usas Tailwind para todo */
</style>
