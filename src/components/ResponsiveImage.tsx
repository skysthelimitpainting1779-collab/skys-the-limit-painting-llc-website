import type { ImgHTMLAttributes } from 'react';

type ResponsiveImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'decoding'
> & {
  width: number;
  height: number;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
};

export default function ResponsiveImage({
  alt,
  width,
  height,
  loading = 'lazy',
  fetchPriority = 'auto',
  ...props
}: ResponsiveImageProps) {
  return (
    <img
      {...props}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
    />
  );
}
