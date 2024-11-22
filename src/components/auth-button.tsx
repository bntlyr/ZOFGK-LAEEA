'use client';

import { useState } from 'react';
import { Button } from './ui/button';  // Make sure this is correctly imported
import { signIn, signOut, useSession } from 'next-auth/react';  // Import necessary methods from next-auth

export function AuthButton() {
  const { data: session, status } = useSession(); // Track session state
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google'); // Trigger the Google sign-in flow
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(); // Sign out the user
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (status === 'loading') {
    return <Button disabled>Loading...</Button>; // Show loading state while checking session
  }

  return session ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-700">{session.user?.email}</span>
      <Button
        variant="outline"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  ) : (
    <Button
      onClick={handleSignIn}
      disabled={loading}
      className="bg-blue-600 text-white hover:bg-blue-700"
    >
      {loading ? 'Signing in...' : 'Sign in with Google'}
    </Button>
  );
}
