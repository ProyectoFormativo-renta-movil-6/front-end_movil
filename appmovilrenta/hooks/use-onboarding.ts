import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OnboardingStore {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboarding = create<OnboardingStore>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      currentStep: 0,
      setCurrentStep: (step: number) => set({ currentStep: step }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () =>
        set({ hasCompletedOnboarding: false, currentStep: 0 }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
