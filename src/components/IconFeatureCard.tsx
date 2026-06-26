import type { LucideIcon } from 'lucide-react';

interface IconFeatureCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
  className?: string;
  iconSize?: number;
  iconClassName?: string;
  titleClassName?: string;
  bodyClassName?: string;
  as?: 'article' | 'div';
}

export default function IconFeatureCard({
  icon: Icon,
  title,
  body,
  className = 'border-l border-[#f0c067]/35 bg-[#11100d]/88 p-6',
  iconSize = 28,
  iconClassName = 'mb-8 text-[#f0c067]',
  titleClassName = 'text-xl font-black leading-tight text-white',
  bodyClassName = 'mt-4 text-sm leading-relaxed text-[#b9b2a6]',
  as: Tag = 'article',
}: IconFeatureCardProps) {
  return (
    <Tag className={className}>
      <Icon className={iconClassName} size={iconSize} strokeWidth={1.5} />
      <h3 className={titleClassName}>{title}</h3>
      <p className={bodyClassName}>{body}</p>
    </Tag>
  );
}
