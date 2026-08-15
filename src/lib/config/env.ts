function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export function getAwsRegion(): string {
  return readEnv('AWS_REGION') ?? readEnv('AWS_DEFAULT_REGION') ?? 'us-east-1';
}

export function getMediaBucket(): string | undefined {
  return readEnv('AWS_S3_BUCKET');
}

export function getOfficialPrefix(): string {
  return (readEnv('AWS_S3_OFFICIAL_PREFIX') ?? 'gallery/official/').replace(/\/?$/, '/');
}

export function getUploadsPrefix(): string {
  return (readEnv('AWS_S3_UPLOADS_PREFIX') ?? 'uploads/').replace(/\/?$/, '/');
}

export function getMediaItemsTable(): string {
  return readEnv('AWS_DYNAMODB_MEDIA_TABLE') ?? 'GeeNiMediaItems';
}

export function getRateLimitsTable(): string {
  return readEnv('AWS_DYNAMODB_RATE_LIMITS_TABLE') ?? 'GeeNiRateLimits';
}

export function getMediaBaseUrl(): string | undefined {
  const value = readEnv('NEXT_PUBLIC_MEDIA_BASE_URL') ?? readEnv('AWS_CLOUDFRONT_URL');
  return value ? value.replace(/\/$/, '') : undefined;
}

export function isAwsConfigured(): boolean {
  return Boolean(getMediaBucket());
}

export function mediaUrl(key: string): string | undefined {
  const base = getMediaBaseUrl();
  if (!base) {
    return undefined;
  }

  return `${base}/${key.replace(/^\//, '')}`;
}
