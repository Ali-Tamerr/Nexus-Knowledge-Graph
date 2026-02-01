'use client';

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function PopupSignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    // Trigger Google sign-in immediately when this page loads
    // The callback will redirect to /auth/popup-close which will close the popup
    signIn('google', { 
      callbackUrl: '/auth/popup-close'
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-zinc-400">Redirecting to Google...</p>
      </div>
    </div>
  );
}
