// src/types/index.ts
// Estas interfaces deben coincidir con los modelos de FastAPI (Pydantic)

export interface Message {
  id: string;
  chat_id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string; // ISO datetime string
}

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  messages: Message[];
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

export interface User { // Modelo simple de usuario para el futuro
  id: string;
  username: string;
}
