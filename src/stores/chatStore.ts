import { create } from 'zustand';
import { ChatMessage, Project, Employee } from '../types/models';
import { api } from '../lib/apiClient';

interface ChatContext {
  currentProject?: Project;
  availableEmployees?: Employee[];
}

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  context: ChatContext;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  setContext: (context: ChatContext) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  context: {},

  sendMessage: async (content: string) => {
    const { messages, context } = get();
    
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    set({ messages: [...messages, userMessage], isLoading: true });

    try {
      const response = await api.post<{ reply: string }>('/ai/chat', {
        message: content,
        context: {
          projectId: context.currentProject?.id,
          projectName: context.currentProject?.name,
          projectDescription: context.currentProject?.description,
          employeeCount: context.availableEmployees?.length,
        },
      });

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, errorMessage],
        isLoading: false,
      }));
    }
  },

  clearChat: () => set({ messages: [] }),

  setContext: (context: ChatContext) => set({ context }),
}));
