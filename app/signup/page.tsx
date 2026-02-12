"use client"

import WelcomeSignup from '@/components/auth/WelcomeSignup';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

export default function SignupPage() {
  return (
    <OnboardingProvider>
      <WelcomeSignup />
    </OnboardingProvider>
  );
}
