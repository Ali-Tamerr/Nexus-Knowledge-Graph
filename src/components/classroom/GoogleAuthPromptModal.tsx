import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface GoogleAuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleAuthPromptModal({ isOpen, onClose }: GoogleAuthPromptModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddGoogleAccount = async () => {
    try {
      setIsLoading(true);
      
      // Open popup to our custom signin page that triggers the OAuth flow
      const popup = window.open(
        '/auth/popup-signin',
        'google-oauth-popup',
        'width=500,height=600,scrollbars=yes,resizable=yes,left=' + 
        (window.screen.width / 2 - 250) + ',top=' + (window.screen.height / 2 - 300)
      );

      if (!popup) {
        throw new Error('Popup blocked');
      }

      // Listen for messages from the popup (when auth completes)
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'NEXUS_AUTH_SUCCESS' || event.data.type === 'OAUTH_SUCCESS') {
          popup.close();
          window.removeEventListener('message', handleMessage);
          onClose();
          window.location.reload(); // Refresh to get new session
        }
      };

      window.addEventListener('message', handleMessage);

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setIsLoading(false);
        }
      }, 1000);

      // Cleanup after 5 minutes
      setTimeout(() => {
        if (popup && !popup.closed) {
          popup.close();
        }
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        setIsLoading(false);
      }, 300000);

    } catch (error) {
      console.error('Error opening Google OAuth popup:', error);
      setIsLoading(false);
    }
  };

  const handleReLogin = async () => {
    // Same logic as handleAddGoogleAccount
    await handleAddGoogleAccount();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-4">
          Google Account Required
        </h3>
        
        <p className="text-sm text-zinc-400 mb-6">
          Seems like you are not signed in with a google account would you like adding your google account for importing classes?
        </p>
        
        <div className="space-y-3">
          <Button
            variant="brand"
            onClick={handleAddGoogleAccount}
            loading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Redirecting to Google...' : 'Add a google account'}
          </Button>
          
          <div className="text-xs text-zinc-500 font-medium">Or</div>
          
          <Button
            variant="secondary"
            onClick={handleReLogin}
            loading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Redirecting to Google...' : 'Re-log in with a google account'}
          </Button>
          
          <p className="text-xs text-zinc-500 mt-2">
            (log out then log in with google account)
          </p>
          
          {isLoading && (
            <p className="text-xs text-blue-400 mt-3">
              You will be redirected to Google to sign in...
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}