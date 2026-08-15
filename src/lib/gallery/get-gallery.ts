import { listOfficialObjects } from '@/lib/aws/s3';
import { listPublishedMedia } from '@/lib/aws/dynamodb';
import { isAwsConfigured, mediaUrl } from '@/lib/config/env';
import { sanitizeFileName } from '@/lib/uploads/validate';
import type { GalleryItem } from '@/lib/uploads/types';

export const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: 'fallback-sunlit',
    title: 'Sunlit Ceremony',
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
    tag: 'Ceremony',
    kind: 'photo',
    source: 'official',
  },
  {
    id: 'fallback-golden',
    title: 'Golden Hour',
    src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80',
    tag: 'Family',
    kind: 'photo',
    source: 'official',
  },
  {
    id: 'fallback-laughter',
    title: 'Laughter & Love',
    src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80',
    tag: 'Friends',
    kind: 'photo',
    source: 'official',
  },
];

function titleFromKey(key: string): string {
  const fileName = sanitizeFileName(key.split('/').pop() ?? 'Memory');
  return fileName.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'A cherished moment';
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (!isAwsConfigured()) {
    return FALLBACK_GALLERY;
  }

  try {
    const [officialObjects, guestRecords] = await Promise.all([
      listOfficialObjects(),
      listPublishedMedia('guest'),
    ]);

    const official: GalleryItem[] = officialObjects.flatMap((object) => {
      const src = mediaUrl(object.key);
      if (!src) {
        return [];
      }

      return [
        {
          id: object.key,
          title: titleFromKey(object.key),
          src,
          tag: 'Featured',
          kind: 'photo',
          source: 'official',
          createdAt: object.lastModified?.toISOString(),
        },
      ];
    });

    const guests: GalleryItem[] = guestRecords.flatMap((record) => {
      const src = mediaUrl(record.key);
      if (!src) {
        return [];
      }

      return [
        {
          id: record.id,
          title: record.caption?.trim() || record.guestName || 'A guest memory',
          src,
          thumbSrc: record.thumbKey ? mediaUrl(record.thumbKey) : undefined,
          tag: record.event || 'Guest',
          kind: record.kind,
          source: 'guest',
          caption: record.caption,
          guestName: record.guestName,
          createdAt: record.createdAt,
        },
      ];
    });

    const items = [...official, ...guests];
    return items.length > 0 ? items : FALLBACK_GALLERY;
  } catch {
    return FALLBACK_GALLERY;
  }
}
