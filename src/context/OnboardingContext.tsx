import React from 'react';
import { useSettings } from './SettingsContext';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  isOpen: boolean;
}

interface OnboardingContextType {
  isFirstTime: boolean;
  completeOnboarding: () => void;
}

interface OnboardingProviderProps {
  children: React.ReactNode;
}

const OnboardingContext = React.createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { settings, updateSettings } = useSettings();
  const [state, setState] = React.useState<OnboardingState>({
    hasCompletedOnboarding: settings.hasCompletedOnboarding || false,
    currentStep: 0,
    isOpen: false,
  });

  const completeOnboarding = React.useCallback(() => {
    setState((prev: OnboardingState) => ({ ...prev, hasCompletedOnboarding: true }));
    updateSettings({ ...settings, hasCompletedOnboarding: true });
  }, [settings, updateSettings]);

  const value: OnboardingContextType = {
    isFirstTime: !state.hasCompletedOnboarding,
    completeOnboarding
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = React.useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
