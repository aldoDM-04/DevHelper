// src/services/apiService.ts
import axios from 'axios';
import type { Chat} from '@/types'; // O directamente desde los modelos si no creaste types/

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Instancia de Axios (puedes configurarla más, como interceptores para tokens)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchUserChats = async (): Promise<Chat[]> => {
  const response = await apiClient.get<Chat[]>('/chats');
  return response.data;
};

export const createNewChat = async (firstMessageText?: string): Promise<Chat> => {
  const payload = { first_message_text: firstMessageText };
  const response = await apiClient.post<Chat>('/chats', payload);
  return response.data;
};

export const fetchChatDetails = async (chatId: string): Promise<Chat> => {
  // Este endpoint podría no ser necesario si /api/chats ya devuelve mensajes
  // o si los mensajes se obtienen al seleccionar un chat.
  // En nuestro caso, el backend ya devuelve chats con mensajes.
  // Pero lo mantenemos por si la API evoluciona.
  const response = await apiClient.get<Chat>(`/chats/${chatId}`);
  return response.data;
};

export const sendMessageToChat = async (chatId: string, messageText: string): Promise<Chat> => {
  const payload = { text: messageText };
  // El backend devuelve el Chat actualizado con el nuevo mensaje del usuario y la respuesta del tutor
  const response = await apiClient.post<Chat>(`/chats/${chatId}/messages`, payload);
  return response.data;
};
