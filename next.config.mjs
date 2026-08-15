/** @type {import('next').NextConfig} */
const mediaRemotePatterns = [];

const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || process.env.AWS_CLOUDFRONT_URL;
if (mediaBase) {
  try {
    const url = new URL(mediaBase);
    mediaRemotePatterns.push({
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      pathname: '/**',
    });
  } catch {
    // The media URL is optional until AWS is configured.
  }
}

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
      ...mediaRemotePatterns,
    ],
  },
};

export default nextConfig;
