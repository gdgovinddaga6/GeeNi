'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { X } from 'lucide-react';

type PosterLightboxProps = {
  src: string;
  title: string;
};

// A poster thumbnail that opens the full poster in a modal. The native <dialog> handles focus and Escape.
export function PosterLightbox({ src, title }: PosterLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="group relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 sm:w-28"
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 640px) 112px, 80px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="sr-only">View the {title} poster</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`${title} poster`}
        // Clicks on the backdrop land on the dialog element itself.
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        <div className="relative">
          <Image
            src={src}
            alt={`${title} poster`}
            width={735}
            height={920}
            sizes="(min-width: 640px) 560px, 92vw"
            className="h-auto max-h-[85vh] w-[92vw] max-w-[560px] rounded-[20px] object-contain shadow-2xl"
          />
          <button
            type="button"
            onClick={close}
            className="absolute -top-3 right-0 flex h-11 w-11 -translate-y-full items-center justify-center rounded-full bg-white text-ink shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose sm:-right-3 sm:top-0 sm:translate-x-full sm:translate-y-0"
          >
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </dialog>
    </>
  );
}
