import type { CollectionConfig } from 'payload';

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'slug', '_status', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  access: {
    // Published services are public-readable
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: 'published' } };
    },
    create: ({ req }) => req.user != null,
    update: ({ req }) => req.user != null,
    delete: ({ req }) => req.user != null,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-safe identifier, e.g. "interior-painting"',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'Short description for cards and meta tags',
      },
    },
    {
      name: 'body',
      type: 'richText',
      admin: {
        description: 'Full service page content',
      },
    },
    {
      name: 'serviceAreas',
      type: 'relationship',
      relationTo: 'service-areas',
      hasMany: true,
      admin: {
        description: 'Cities/areas where this service is offered',
      },
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    // SEO fields
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
};
