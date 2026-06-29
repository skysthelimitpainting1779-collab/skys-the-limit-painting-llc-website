import Image, { type ImageProps } from 'next/image';

type ResponsiveImageProps = Omit<ImageProps, 'alt' | 'src' | 'decoding' | 'width' | 'height'> & {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  fetchPriority = 'auto',
  ...props
}: ResponsiveImageProps) {
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
    />
  );
}
