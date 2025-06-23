// src/types/index.ts

export interface Message {
  id: string;
  chat_id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  selectedReaction?: 'like' | 'dislike'; 
}

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  username: string; // Puede ser el email
  email: string;
}

// --- Nuevos tipos para Autenticación ---

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    // Puedes añadir más campos si es necesario, ej: username
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}
