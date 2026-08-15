function envFlag(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];

  if (value === undefined) {
    return defaultValue;
  }

  return value === 'true' || value === '1';
}

export const features = {
  upload: envFlag('NEXT_PUBLIC_FEATURE_UPLOAD', true),
  googleAuth: envFlag('NEXT_PUBLIC_FEATURE_GOOGLE_AUTH', false),
} as const;

export type FeatureName = keyof typeof features;
