import type { GlobalConfig } from 'payload';

/**
 * Singleton global: Site Settings
 * Replaces the public.settings table.
 * Public read enabled so the frontend can fetch phone/email/hours without auth.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'System',
  },
  access: {
    read: () => true,
    update: ({ req }) => req.user != null,
  },
  fields: [
    // Contact
    {
      name: 'phone',
      type: 'text',
      defaultValue: '651-410-4196',
      admin: { description: 'Primary business phone (formatted for display)' },
    },
    {
      name: 'smsPhone',
      type: 'text',
      defaultValue: '+16514104196',
      admin: { description: 'E.164 format for SMS/tel links' },
    },
    {
      name: 'email',
      type: 'email',
      defaultValue: 'skysthelimitpainting1779@gmail.com',
    },

    // Business details
    {
      name: 'hours',
      type: 'textarea',
      defaultValue: 'Mon–Fri 7am–6pm, Sat 8am–3pm',
    },
    {
      name: 'license',
      type: 'text',
      defaultValue: 'IR816596',
      admin: { description: 'MN Contractor License number' },
    },
    {
      name: 'insuranceNote',
      type: 'text',
      defaultValue: '$1M liability + workers comp',
    },

    // Service area list (used by SEO, nav, etc.)
    {
      name: 'serviceAreaList',
      type: 'array',
      fields: [{ name: 'city', type: 'text' }],
      admin: { description: 'Ordered list of served cities for nav/SEO use' },
    },

    // CTA links
    {
      name: 'calComLink',
      type: 'text',
      admin: { description: 'Cal.com booking link URL' },
    },
    {
      name: 'googleReviewLink',
      type: 'text',
      admin: { description: 'Google Business review URL' },
    },

    // Social
    {
      name: 'facebookUrl',
      type: 'text',
    },
    {
      name: 'instagramUrl',
      type: 'text',
    },
    {
      name: 'nextdoorUrl',
      type: 'text',
    },

    // Brand
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Residential detail. Commercial discipline. Public-sector ready.',
    },
  ],
};
