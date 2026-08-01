'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { OnboardingWizard } from '@/components/workspace/onboarding-wizard';

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated) {
    return null; // Will be redirected by auth guards or simply return null
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir="rtl">
      <OnboardingWizard 
        onComplete={() => router.push('/')} 
        onCancel={() => router.push('/')} 
      />
    </div>
  );
}
