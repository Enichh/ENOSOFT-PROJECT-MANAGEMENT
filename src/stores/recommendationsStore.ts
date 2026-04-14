import { create } from 'zustand';
import { EmployeeRecommendation } from '../types/models';
import { api } from '../lib/apiClient';

interface RecommendationsStore {
  currentRecommendations: EmployeeRecommendation[];
  isLoading: boolean;
  error: string | null;
  cache: Record<string, EmployeeRecommendation[]>;
  fetchRecommendations: (projectId: string, requiredSkills?: string[]) => Promise<void>;
  acceptRecommendation: (employeeId: string) => void;
  clearRecommendations: () => void;
}

export const useRecommendationsStore = create<RecommendationsStore>((set, get) => ({
  currentRecommendations: [],
  isLoading: false,
  error: null,
  cache: {},

  fetchRecommendations: async (projectId: string, requiredSkills?: string[]) => {
    const { cache } = get();
    
    if (cache[projectId]) {
      set({ currentRecommendations: cache[projectId] });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await api.post<{ recommendations: EmployeeRecommendation[] }>('/ai/recommend', {
        projectId,
        requiredSkills,
      });

      set((state) => ({
        currentRecommendations: response.recommendations,
        isLoading: false,
        cache: { ...state.cache, [projectId]: response.recommendations },
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recommendations',
      });
    }
  },

  acceptRecommendation: (employeeId: string) => {
    set((state) => ({
      currentRecommendations: state.currentRecommendations.filter(
        (rec) => rec.employeeId !== employeeId
      ),
    }));
  },

  clearRecommendations: () => set({ currentRecommendations: [], error: null }),
}));
