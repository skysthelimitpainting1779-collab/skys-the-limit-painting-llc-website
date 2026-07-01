import { Music2 } from 'lucide-react';

const Facebook = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Linkedin = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

import { ENV } from '../lib/env';

const socialLinks = [
  { label: 'Facebook', url: ENV.FACEBOOK_URL, icon: Facebook },
  { label: 'Instagram', url: ENV.INSTAGRAM_URL, icon: Instagram },
  { label: 'LinkedIn', url: ENV.LINKEDIN_URL, icon: Linkedin },
  { label: 'TikTok', url: ENV.TIKTOK_URL, icon: Music2 },
].filter((item) => Boolean(item.url));

export default function SocialLinks() {
  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {socialLinks.map(({ label, url, icon: Icon }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          data-track="social_click"
          data-track-payload={JSON.stringify({ label })}
          className="grid h-11 w-11 place-items-center border border-white/15 bg-white/5 text-white transition-colors hover:border-white hover:text-white"
        >
          <Icon size={19} />
        </a>
      ))}
    </div>
  );
}
