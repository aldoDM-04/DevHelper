<script setup lang="ts">
// Define el path SVG para el ícono de usuario que usaremos en todos los botones de prueba
const userIconPath =
  'M12 4a4 4 0 100 8 4 4 0 000-8zm-2 9a5 5 0 00-5 5v1a2 2 0 002 2h10a2 2 0 002-2v-1a5 5 0 00-5-5h-4z'
const home = 'M3 12l9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z'
const estadisticas = 'M4 9v10h4V9H4zm6 3v7h4v-7h-4zm6-3v10h4V9h-4z'
const calendario =
  'M17 3h-2v2H9V3H7v2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3V3zM20 21H4V9h16v12z'
const icono1 = 'M13 2v8h6l-8 12v-9H5l8-11h-1z'
const notification =
  'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z'
const settings =
  'M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z'
</script>

<template>
  <div class="bg-gray-800 text-white w-16 flex flex-col items-center py-4 space-y-5">
    <div class="mb-2">
      <img src="/src/assets/logo.png" alt="Logo del ChatBot" class="w-10 h-10" />
    </div>

    <button
      class="group p-2 rounded-full flex items-center justify-center transition-all duration-110 hover:bg-white hover:rounded-md hover:scale-110 cursor-pointer"
      aria-label="Botón de Prueba Azul"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-6 h-6 transition-colors duration-200 text-white-400 group-hover:text-blue-600"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fill-rule="evenodd" :d="home" clip-rule="evenodd"></path>
      </svg>
    </button>

    <button
      class="group p-2 rounded-full flex items-center justify-center transition-all duration-110 hover:bg-white hover:rounded-md hover:scale-110 cursor-pointer"
      aria-label="Botón de Prueba Verde"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-6 h-6 transition-colors duration-200 text-white-400 group-hover:text-green-600"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fill-rule="evenodd" :d="estadisticas" clip-rule="evenodd"></path>
      </svg>
    </button>

    <button
      class="group p-2 rounded-full flex items-center justify-center transition-all duration-110 hover:bg-white hover:rounded-md hover:scale-110 cursor-pointer"
      aria-label="Botón de Prueba Rojo"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-6 h-6 transition-colors duration-200 text-white-400 group-hover:text-red-600"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fill-rule="evenodd" :d="userIconPath" clip-rule="evenodd"></path>
      </svg>
    </button>

    <button
      class="group p-2 rounded-full flex items-center justify-center transition-all duration-110 hover:bg-white hover:rounded-md hover:scale-110 cursor-pointer"
      aria-label="Botón de Prueba Rojo"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-6 h-6 transition-colors duration-200 text-white-400 group-hover:text-orange-600"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fill-rule="evenodd" :d="calendario" clip-rule="evenodd"></path>
      </svg>
    </button>

    <button
      class="group p-2 rounded-full flex items-center justify-center transition-all duration-110 hover:bg-white hover:rounded-md hover:scale-110 cursor-pointer"
      aria-label="Botón de Prueba Rojo"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-6 h-6 transition-colors duration-200 text-white-400 group-hover:text-yellow-500"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fill-rule="evenodd" :d="icono1" clip-rule="evenodd"></path>
      </svg>
    </button>

    <button
      class="group p-2 rounded-full flex items-center justify-center transition-all duration-110 hover:bg-white hover:rounded-md hover:scale-110 cursor-pointer"
      aria-label="Botón de Prueba Rojo"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-6 h-6 transition-colors duration-200 text-white-400 group-hover:text-purple-600"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fill-rule="evenodd" :d="notification" clip-rule="evenodd"></path>
      </svg>
    </button>

    <div class="flex-grow"></div>

    <button
      class="group p-2 rounded-full flex items-center justify-center transition-all duration-110 hover:bg-white hover:rounded-md hover:scale-110 cursor-pointer"
      aria-label="Cuenta"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-6 h-6 transition-colors duration-200 text-white-400 group-hover:text-blue-600"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fill-rule="evenodd" :d="settings" clip-rule="evenodd"></path>
      </svg>
    </button>

    <div class="mt-auto">
      <img
        src="/src/assets/userIcon.png"
        alt="Foto de Perfil de Usuario"
        class="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
