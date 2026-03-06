'use client';
import { getAssetUrl } from '@/lib/api';
import { ImageIcon } from 'lucide-react';

const VIDEO_EXTS = ['.mp4', '.mov', '.webm', '.avi', '.mkv', '.m4v', '.wmv', '.3gp'];

const isVideo = (path: string) => VIDEO_EXTS.some((ext) => path?.toLowerCase().endsWith(ext));

interface ProductMediaProps {
  path: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  objectFit?: 'cover' | 'contain';
}

export function ProductMedia({ path, alt = '', className = '', imgClassName = '', objectFit = 'cover' }: ProductMediaProps) {
  if (!path) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 ${className}`}>
        <ImageIcon className="w-10 h-10 text-gray-300" />
      </div>
    );
  }
  const url = getAssetUrl(path);
  if (isVideo(path)) {
    return (
      <video
        src={url}
        className={className}
        controls
        playsInline
        muted
        loop
        style={{ objectFit, width: '100%', height: '100%' }}
      />
    );
  }
  return (
    <div
      className={className}
      style={{ backgroundImage: `url(${url})`, backgroundSize: objectFit, backgroundPosition: 'center' }}
    />
  );
}
