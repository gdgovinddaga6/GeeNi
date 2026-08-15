import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { features } from '@/lib/config/features';

const handler = NextAuth(authOptions);

async function disabled() {
  return Response.json(
    { message: 'Google sign-in is currently turned off.' },
    { status: 404 },
  );
}

export const GET = features.googleAuth ? handler : disabled;
export const POST = features.googleAuth ? handler : disabled;
