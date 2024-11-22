'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';

export function SignInButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">{session.user.email}</span>
        <Button
          variant="outline"
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => signIn('google')}
      className="bg-blue-600 text-white hover:bg-blue-700"
    >
      Sign in with Google
    </Button>
  );
}