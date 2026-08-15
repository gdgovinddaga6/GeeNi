import type { WeddingEvent } from '@/lib/uploads/limits';

export type MediaKind = 'photo' | 'video';
export type MediaSource = 'official' | 'guest';
export type MediaStatus = 'pending' | 'published';

export type PresignFileRequest = {
  fileName: string;
  contentType: string;
  size: number;
  kind: MediaKind;
  hasThumbnail: boolean;
};

export type PresignRequestBody = {
  files: PresignFileRequest[];
  guestName: string;
  caption?: string;
  event?: WeddingEvent | string;
};

export type PresignUpload = {
  id: string;
  key: string;
  url: string;
  contentType: string;
  thumbKey?: string;
  thumbUrl?: string;
  thumbContentType?: string;
};

export type PresignResponseBody = {
  sessionId: string;
  uploads: PresignUpload[];
};

export type CompleteUploadItem = {
  id: string;
  key: string;
  contentType: string;
  size: number;
  kind: MediaKind;
  guestName: string;
  caption?: string;
  event?: string;
  thumbKey?: string;
};

export type CompleteRequestBody = {
  items: CompleteUploadItem[];
};

export type GalleryItem = {
  id: string;
  title: string;
  src: string;
  thumbSrc?: string;
  tag: string;
  kind: MediaKind;
  source: MediaSource;
  caption?: string;
  guestName?: string;
  createdAt?: string;
};

export type DistilledFile = {
  fileName: string;
  kind: MediaKind;
  original: Blob;
  originalType: string;
  thumbnail: Blob | null;
  thumbnailType: string | null;
};

export type MediaRecord = {
  id: string;
  source: MediaSource;
  status: MediaStatus;
  key: string;
  thumbKey?: string;
  contentType: string;
  size: number;
  kind: MediaKind;
  guestName: string;
  caption?: string;
  event?: string;
  createdAt: string;
};
