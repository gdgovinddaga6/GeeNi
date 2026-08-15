import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { features } from '@/lib/config/features';

function googleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return undefined;
  }

  return { clientId, clientSecret };
}

export function isGoogleAuthReady(): boolean {
  return features.googleAuth && Boolean(googleCredentials());
}

export const authOptions: NextAuthOptions = {
  providers: (() => {
    const credentials = googleCredentials();
    if (!features.googleAuth || !credentials) {
      return [];
    }

    return [GoogleProvider(credentials)];
  })(),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/upload',
  },
};
