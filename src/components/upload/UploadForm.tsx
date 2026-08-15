'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CheckCircle2, UploadCloud } from 'lucide-react';
import { GoogleSignIn } from '@/components/auth/GoogleSignIn';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { distillFile } from '@/lib/uploads/distill';
import { formatBytes, UPLOAD_LIMITS, WEDDING_EVENTS } from '@/lib/uploads/limits';
import type { CompleteUploadItem, DistilledFile, PresignResponseBody, PresignUpload } from '@/lib/uploads/types';
import { inferMediaKind, validateFileBatch, validateGuestName } from '@/lib/uploads/validate';

type UploadFormProps = {
  requireGoogle: boolean;
};

type ProgressState = {
  percent: number;
  label: string;
};

function readErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
    return payload.message;
  }

  return fallback;
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

async function putWithProgress(url: string, blob: Blob, contentType: string, onProgress: (ratio: number) => void) {
  await new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('PUT', url);
    request.setRequestHeader('Content-Type', contentType);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(event.loaded / event.total);
      }
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
        return;
      }

      reject(new Error('A file could not be uploaded. Please try again.'));
    };
    request.onerror = () => reject(new Error('A file could not be uploaded. Please try again.'));
    request.send(blob);
  });
}

function UploadFields({
  requireGoogle,
  defaultGuestName,
}: {
  requireGoogle: boolean;
  defaultGuestName: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [guestName, setGuestName] = useState(defaultGuestName);
  const [eventName, setEventName] = useState('');
  const [caption, setCaption] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const selectedSummary = useMemo(() => {
    if (files.length === 0) {
      return 'No files selected yet.';
    }

    const total = files.reduce((sum, file) => sum + file.size, 0);
    return `${files.length} file${files.length > 1 ? 's' : ''} selected · ${formatBytes(total)}`;
  }, [files]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles(selectedFiles);
    setStatus('');
    setError('');
    setCompletedCount(0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setStatus('');
    setCompletedCount(0);

    const nameResult = validateGuestName(guestName);
    if (!nameResult.ok) {
      setError(nameResult.message);
      return;
    }

    const batch = files.map((file) => ({
      fileName: file.name,
      contentType: file.type || (inferMediaKind('', file.name) === 'video' ? 'video/mp4' : 'image/jpeg'),
      size: file.size,
      kind: inferMediaKind(file.type, file.name) ?? 'photo',
      hasThumbnail: true,
    }));

    const batchResult = validateFileBatch(batch);
    if (!batchResult.ok) {
      setError(batchResult.message);
      return;
    }

    setIsUploading(true);
    setProgress({ percent: 2, label: 'Preparing your memories…' });

    try {
      const distilled: DistilledFile[] = [];
      for (let index = 0; index < files.length; index += 1) {
        setProgress({
          percent: Math.round(((index + 0.4) / files.length) * 30),
          label: `Preparing ${index + 1} of ${files.length}…`,
        });
        distilled.push(await distillFile(files[index]));
      }

      const presignResponse = await fetch('/api/uploads/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guestName.trim(),
          caption: caption.trim() || undefined,
          event: eventName || undefined,
          files: distilled.map((file, index) => ({
            fileName: file.fileName,
            contentType: file.originalType,
            size: file.original.size,
            kind: file.kind,
            hasThumbnail: Boolean(file.thumbnail),
            originalName: files[index]?.name,
          })),
        }),
      });

      const presignPayload = await parseJson(presignResponse);
      if (!presignResponse.ok) {
        throw new Error(readErrorMessage(presignPayload, 'We could not start the upload. Please try again.'));
      }

      const presign = presignPayload as PresignResponseBody;
      const completed: CompleteUploadItem[] = [];

      for (let index = 0; index < distilled.length; index += 1) {
        const file = distilled[index];
        const slot: PresignUpload | undefined = presign.uploads[index];
        if (!slot) {
          throw new Error('We could not start the upload. Please try again.');
        }

        const basePercent = 30 + (index / distilled.length) * 60;
        setProgress({
          percent: Math.round(basePercent),
          label: `Uploading ${index + 1} of ${distilled.length}…`,
        });

        await putWithProgress(slot.url, file.original, slot.contentType, (ratio) => {
          setProgress({
            percent: Math.round(basePercent + ratio * (60 / distilled.length) * 0.8),
            label: `Uploading ${index + 1} of ${distilled.length}…`,
          });
        });

        if (file.thumbnail && slot.thumbUrl && slot.thumbContentType) {
          await putWithProgress(slot.thumbUrl, file.thumbnail, slot.thumbContentType, () => undefined);
        }

        completed.push({
          id: slot.id,
          key: slot.key,
          contentType: slot.contentType,
          size: file.original.size,
          kind: file.kind,
          guestName: guestName.trim(),
          caption: caption.trim() || undefined,
          event: eventName || undefined,
          thumbKey: slot.thumbKey,
        });
      }

      setProgress({ percent: 94, label: 'Finishing up…' });

      const completeResponse = await fetch('/api/uploads/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: completed }),
      });
      const completePayload = await parseJson(completeResponse);
      if (!completeResponse.ok) {
        throw new Error(readErrorMessage(completePayload, 'Your files uploaded, but we could not add them to the gallery yet.'));
      }

      setProgress({ percent: 100, label: 'Done' });
      setCompletedCount(completed.length);
      setStatus(
        `Thank you for sharing ${completed.length} ${completed.length === 1 ? 'memory' : 'memories'}.`,
      );
      setFiles([]);
      setCaption('');
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Something went wrong. Please try again.';
      setError(message);
      setProgress(null);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <Card className="border-[#efe3d5] bg-white/85">
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <UploadCloud className="h-5 w-5 text-rose" />
              <div>
                <h2 className="font-display text-2xl text-ink">Upload Your Memories</h2>
                <p className="text-sm text-muted">
                  Select photos or videos from your device. We gently prepare them, then add them to the gallery.
                </p>
              </div>
            </div>

            {requireGoogle ? <GoogleSignIn /> : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="guest-name" className="block text-sm font-medium text-ink">
                  Your name
                </label>
                <input
                  id="guest-name"
                  name="guestName"
                  autoComplete="name"
                  required
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  className="w-full rounded-2xl border border-[#e9ddd0] bg-white px-3 py-3 text-sm text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="event-name" className="block text-sm font-medium text-ink">
                  Event
                </label>
                <select
                  id="event-name"
                  name="event"
                  value={eventName}
                  onChange={(event) => setEventName(event.target.value)}
                  className="w-full rounded-2xl border border-[#e9ddd0] bg-white px-3 py-3 text-sm text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/10"
                >
                  <option value="">Choose an event (optional)</option>
                  {WEDDING_EVENTS.map((event) => (
                    <option key={event} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="caption" className="block text-sm font-medium text-ink">
                Caption
              </label>
              <textarea
                id="caption"
                name="caption"
                rows={3}
                maxLength={280}
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="A few words about this moment (optional)"
                className="w-full rounded-2xl border border-[#e9ddd0] bg-white px-3 py-3 text-sm text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/10"
              />
            </div>

            <div className="space-y-4 rounded-3xl border border-[#efe3d5] bg-[#fcfaf7] p-6">
              <label htmlFor="memories" className="block text-sm font-medium text-ink">
                Choose files
              </label>
              <input
                id="memories"
                type="file"
                multiple
                accept="image/*,video/*,.heic,.heif"
                onChange={handleFileChange}
                className="w-full rounded-2xl border border-[#e9ddd0] bg-white px-3 py-3 text-sm text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/10"
              />
              <p className="text-sm text-muted">{selectedSummary}</p>
              <p className="text-xs leading-6 text-muted">
                Up to {UPLOAD_LIMITS.maxFilesPerSession} files, {formatBytes(UPLOAD_LIMITS.maxBytesPerFile)} each, and{' '}
                {formatBytes(UPLOAD_LIMITS.maxBytesPerSession)} per session.
              </p>
            </div>

            {progress ? (
              <div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-[#efe3d5]"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress.percent}
                  aria-label="Upload progress"
                >
                  <div className="h-full rounded-full bg-rose transition-all duration-200" style={{ width: `${progress.percent}%` }} />
                </div>
                <p className="mt-2 text-sm text-muted" aria-live="polite">
                  {progress.label}
                </p>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" className="w-full sm:w-auto" disabled={isUploading}>
                {isUploading ? 'Uploading…' : 'Upload now'}
              </Button>
              <div aria-live="polite">
                {error ? (
                  <p className="rounded-3xl border border-[#e9ddd0] bg-[#f7f0ea] px-4 py-3 text-sm text-ink">{error}</p>
                ) : null}
                {status ? (
                  <div className="flex items-center gap-2 rounded-3xl border border-[#e9ddd0] bg-[#f7f0ea] px-4 py-3 text-sm text-ink">
                    <CheckCircle2 className="h-4 w-4 text-rose" />
                    <span>{status}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {completedCount > 0 ? (
              <p className="text-sm text-muted">
                You can add more whenever you like, or visit the gallery to see memories as they appear.
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

function AuthenticatedUploadForm({ requireGoogle }: UploadFormProps) {
  const { data, status } = useSession();

  if (status === 'loading') {
    return (
      <Card className="mt-10 border-[#efe3d5] bg-white/85">
        <CardContent>
          <p className="text-sm text-muted" role="status">
            Checking your sign-in…
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data?.user) {
    return (
      <Card className="mt-10 border-[#efe3d5] bg-white/85">
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <UploadCloud className="h-5 w-5 text-rose" />
              <div>
                <h2 className="font-display text-2xl text-ink">Upload Your Memories</h2>
                <p className="text-sm text-muted">Please sign in with Google to begin.</p>
              </div>
            </div>
            <GoogleSignIn />
          </div>
        </CardContent>
      </Card>
    );
  }

  return <UploadFields requireGoogle={requireGoogle} defaultGuestName={data.user.name ?? ''} />;
}

export function UploadForm({ requireGoogle }: UploadFormProps) {
  if (requireGoogle) {
    return <AuthenticatedUploadForm requireGoogle={requireGoogle} />;
  }

  return <UploadFields requireGoogle={false} defaultGuestName="" />;
}
