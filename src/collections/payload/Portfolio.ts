import type { CollectionConfig } from 'payload';

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'service', 'location', 'featured', 'approved', 'updatedAt'],
  },
  access: {
    // Only approved portfolio items are public
    read: ({ req }) => {
      if (req.user) return true;
      return { approved: { equals: true } };
    },
    create: ({ req }) => req.user != null,
    update: ({ req }) => req.user != null,
    delete: ({ req }) => req.user != null,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      admin: { description: 'City/neighborhood — no full address' },
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
    },
    {
      name: 'beforeImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'afterImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'date',
      type: 'date',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show on homepage portfolio section' },
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Must be approved before appearing publicly' },
    },
  ],
};
