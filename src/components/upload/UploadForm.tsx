'use client';

import { ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, UploadCloud } from 'lucide-react';

export function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string>('');

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles(selectedFiles);
    setStatus('');
  }

  function handleUpload() {
    if (files.length === 0) {
      setStatus('Please choose one or more files first.');
      return;
    }

    setStatus('Uploading...');
    window.setTimeout(() => {
      setStatus(`Uploaded ${files.length} file${files.length > 1 ? 's' : ''}.`);
      setFiles([]);
    }, 800);
  }

  return (
    <Card className="mt-10 border-[#efe3d5] bg-white/85">
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <UploadCloud className="h-5 w-5 text-rose" />
            <div>
              <h2 className="font-display text-2xl text-ink">Upload Your Memories</h2>
              <p className="text-sm text-muted">Select photos or videos from your device and then confirm to add them to the gallery.</p>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-[#efe3d5] bg-[#fcfaf7] p-6">
            <label className="block text-sm font-medium text-ink">Choose files</label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full rounded-2xl border border-[#e9ddd0] bg-white px-3 py-3 text-sm text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/10"
            />
            <div className="text-sm text-muted">
              {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} selected` : 'No files selected yet.'}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button onClick={handleUpload} className="w-full sm:w-auto">
              Upload now
            </Button>
            {status && (
              <div className="flex items-center gap-2 rounded-3xl border border-[#e9ddd0] bg-[#f7f0ea] px-4 py-3 text-sm text-ink">
                <CheckCircle2 className="h-4 w-4 text-rose" />
                <span>{status}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
