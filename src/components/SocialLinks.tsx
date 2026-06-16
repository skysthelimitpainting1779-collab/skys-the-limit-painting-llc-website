import { Facebook, Instagram, Linkedin, Music2 } from 'lucide-react';

const socialLinks = [
  { label: 'Facebook', url: import.meta.env.VITE_FACEBOOK_URL, icon: Facebook },
  { label: 'Instagram', url: import.meta.env.VITE_INSTAGRAM_URL, icon: Instagram },
  { label: 'LinkedIn', url: import.meta.env.VITE_LINKEDIN_URL, icon: Linkedin },
  { label: 'TikTok', url: import.meta.env.VITE_TIKTOK_URL, icon: Music2 },
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
          className="grid h-11 w-11 place-items-center border border-white/15 bg-white/5 text-white transition-colors hover:border-orange-safety hover:text-orange-safety"
        >
          <Icon size={19} />
        </a>
      ))}
    </div>
  );
}
