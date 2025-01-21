import { OnboardingForm } from '@/components/auth/OnboardingForm';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

export default function OnboardingPage() {
  return (
    <ErrorBoundary>
      <div
        className='min-h-screen bg-gradient-to-b from-[#F5F2F2] to-[#F7E8E8] py-12'
        role='main'
        aria-label='Onboarding page'
      >
        <div role='region' aria-label='Onboarding form section'>
          <OnboardingForm />
        </div>
      </div>
    </ErrorBoundary>
  );
}
