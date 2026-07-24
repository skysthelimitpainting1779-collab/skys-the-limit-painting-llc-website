import type { CollectionConfig } from 'payload';

export const ServiceAreas: CollectionConfig = {
  slug: 'service-areas',
  admin: {
    useAsTitle: 'city',
    group: 'Content',
    defaultColumns: ['city', 'state', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true, // All service area data is public
    create: ({ req }) => req.user != null,
    update: ({ req }) => req.user != null,
    delete: ({ req }) => req.user != null,
  },
  fields: [
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'state',
      type: 'text',
      defaultValue: 'MN',
      maxLength: 2,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug, e.g. "saint-paul-mn"',
      },
    },
    {
      name: 'seoBlurb',
      type: 'textarea',
      admin: {
        description: 'Short SEO paragraph for programmatic local pages',
      },
    },
    // Latitude/longitude for future map features
    {
      name: 'coordinates',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
  ],
};
