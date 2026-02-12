import { ONBOARDING_STEPS, type OnboardingStep } from '@/types/onboarding';

export function getOnboardingStepNumber(stepId: OnboardingStep): number {
  return ONBOARDING_STEPS.indexOf(stepId) + 1;
}

export const TOTAL_ONBOARDING_STEPS = ONBOARDING_STEPS.length;
