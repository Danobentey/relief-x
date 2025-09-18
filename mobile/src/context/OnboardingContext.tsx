import React, { createContext, useContext, useState, useCallback } from 'react';
import { track } from '../analytics';

interface OnboardingState {
  painAreas: string[];
  answers: Record<string, string>;
  completed: boolean;
}

interface OnboardingContextValue extends OnboardingState {
  setPainAreas: (areas: string[]) => void;
  setAnswer: (key: string, value: string) => void;
  markCompleted: () => void;
  reset: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OnboardingState>({ painAreas: [], answers: {}, completed: false });

  const setPainAreas = useCallback((areas: string[]) => {
    setState(prev => ({ ...prev, painAreas: areas }));
  }, []);

  const setAnswer = useCallback((key: string, value: string) => {
    setState(prev => ({ ...prev, answers: { ...prev.answers, [key]: value } }));
  }, []);

  const markCompleted = useCallback(() => {
    setState(prev => ({ ...prev, completed: true }));
    track('pr_onboarding_completed', { pain_areas_count: state.painAreas.length }).catch(() => {});
  }, [state.painAreas.length]);

  const reset = useCallback(() => setState({ painAreas: [], answers: {}, completed: false }), []);

  return (
    <OnboardingContext.Provider value={{ ...state, setPainAreas, setAnswer, markCompleted, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
