// src/services/apiService.ts
import axios from 'axios';
import type { Chat, LoginCredentials, RegisterCredentials, TokenResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
//'http://localhost:8000'
//'https://backend-chatbot-cnds.onrender.com'
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para establecer el encabezado de autorización
export const setAuthHeader = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};


// --- Métodos de Autenticación ---

export const loginUser = async (credentials: LoginCredentials): Promise<TokenResponse> => {
    // FastAPI espera los datos de login como FormData
    const formData = new URLSearchParams();
    formData.append('username', credentials.email); // FastAPI-Users espera 'username'
    formData.append('password', credentials.password);

    const response = await apiClient.post<TokenResponse>('/api/auth/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
};

export const registerUser = async (credentials: RegisterCredentials) => {
    const response = await apiClient.post('/api/auth/register', credentials);
    return response.data;
};

// --- Métodos del Chat (ahora requieren token) ---

export const fetchUserChats = async (): Promise<Chat[]> => {
  const response = await apiClient.get<Chat[]>('/api/chats');
  return response.data;
};

export const createNewChat = async (firstMessageText?: string): Promise<Chat> => {
  const payload = { first_message_text: firstMessageText };
  const response = await apiClient.post<Chat>('/api/chats', payload);
  return response.data;
};

export const sendMessageToChat = async (chatId: string, messageText: string): Promise<Chat> => {
  const payload = { text: messageText };
  const response = await apiClient.post<Chat>(`/api/chats/${chatId}/messages`, payload);
  return response.data;
};
