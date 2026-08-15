'use client';

import { UPLOAD_LIMITS } from '@/lib/uploads/limits';
import { inferMediaKind, isImageFileName } from '@/lib/uploads/validate';
import type { DistilledFile, MediaKind } from '@/lib/uploads/types';

const HEIC_TYPE = /image\/hei(c|f)/i;
const HEIC_NAME = /\.hei(c|f)$/i;

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('We could not prepare this photo. Please try another file.'));
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('We could not read this photo. Please try another file.'));
    image.src = src;
  });
}

function drawResized(image: HTMLImageElement, maxEdge: number): HTMLCanvasElement {
  const longest = Math.max(image.width, image.height);
  const scale = longest > maxEdge ? maxEdge / longest : 1;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('We could not prepare this photo. Please try another file.');
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

async function blobFromImageSource(src: string, maxEdge: number): Promise<Blob> {
  const image = await loadImage(src);
  const canvas = drawResized(image, maxEdge);
  return canvasToBlob(canvas, 'image/jpeg', UPLOAD_LIMITS.jpegQuality);
}

async function convertHeic(file: File): Promise<Blob> {
  const heic2any = (await import('heic2any')).default;
  const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: UPLOAD_LIMITS.jpegQuality });
  return Array.isArray(result) ? result[0] : result;
}

async function distillPhoto(file: File): Promise<DistilledFile> {
  const needsHeicConversion = HEIC_TYPE.test(file.type) || HEIC_NAME.test(file.name);
  const sourceBlob = needsHeicConversion ? await convertHeic(file) : file;
  const objectUrl = URL.createObjectURL(sourceBlob);

  try {
    const original = await blobFromImageSource(objectUrl, UPLOAD_LIMITS.longEdgePixels);
    const thumbnail = await blobFromImageSource(objectUrl, UPLOAD_LIMITS.thumbnailPixels);
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'memory';

    return {
      fileName: `${baseName}.jpg`,
      kind: 'photo',
      original,
      originalType: 'image/jpeg',
      thumbnail,
      thumbnailType: 'image/jpeg',
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function captureVideoPoster(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    let settled = false;

    const finish = (blob: Blob | null) => {
      if (settled) {
        return;
      }

      settled = true;
      URL.revokeObjectURL(objectUrl);
      resolve(blob);
    };

    window.setTimeout(() => finish(null), 4000);

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    video.addEventListener('loadeddata', () => {
      video.currentTime = Math.min(0.2, video.duration || 0.2);
    });

    video.addEventListener('seeked', () => {
      try {
        const longest = Math.max(video.videoWidth, video.videoHeight) || 1;
        const scale = longest > UPLOAD_LIMITS.thumbnailPixels ? UPLOAD_LIMITS.thumbnailPixels / longest : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round((video.videoWidth || 640) * scale));
        canvas.height = Math.max(1, Math.round((video.videoHeight || 360) * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          finish(null);
          return;
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => finish(blob), 'image/jpeg', UPLOAD_LIMITS.jpegQuality);
      } catch {
        finish(null);
      }
    });

    video.addEventListener('error', () => finish(null));
  });
}

async function distillVideo(file: File): Promise<DistilledFile> {
  const thumbnail = await captureVideoPoster(file);

  return {
    fileName: file.name,
    kind: 'video',
    original: file,
    originalType: file.type || 'video/mp4',
    thumbnail,
    thumbnailType: thumbnail ? 'image/jpeg' : null,
  };
}

export async function distillFile(file: File): Promise<DistilledFile> {
  const kind: MediaKind = inferMediaKind(file.type, file.name) === 'video' ? 'video' : 'photo';

  if (kind === 'video') {
    return distillVideo(file);
  }

  if (!file.type && !isImageFileName(file.name)) {
    throw new Error('Please upload a photo or video.');
  }

  return distillPhoto(file);
}
