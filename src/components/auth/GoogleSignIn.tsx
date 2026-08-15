'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function GoogleSignIn() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <p className="text-sm text-muted" role="status">
        Checking your sign-in…
      </p>
    );
  }

  if (session?.user) {
    return (
      <div className="flex flex-col gap-3 rounded-3xl border border-[#efe3d5] bg-[#fcfaf7] p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink">
          Signed in as <span className="font-medium">{session.user.name ?? session.user.email}</span>
        </p>
        <Button type="button" variant="secondary" onClick={() => signOut({ callbackUrl: '/upload' })}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-[#efe3d5] bg-[#fcfaf7] p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm leading-7 text-muted">Sign in with Google to share your memories with Nidhi and Govind.</p>
      <Button type="button" onClick={() => signIn('google', { callbackUrl: '/upload' })}>
        Continue with Google
      </Button>
    </div>
  );
}
