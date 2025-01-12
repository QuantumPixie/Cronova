import { OnboardingForm } from '@/components/auth/OnboardingForm';

export default function OnboardingPage() {
  return (
    <div
      className='min-h-screen bg-gradient-to-b from-[#F5F2F2] to-[#F7E8E8] py-12'
      role='main'
      aria-label='Onboarding page'
    >
      <div role='region' aria-label='Onboarding form section'>
        <OnboardingForm />
      </div>
    </div>
  );
}
