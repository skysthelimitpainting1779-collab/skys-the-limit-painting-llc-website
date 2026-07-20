import type { CollectionConfig } from 'payload';

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'author',
    group: 'Content',
    defaultColumns: ['author', 'city', 'rating', 'approved', 'source', 'updatedAt'],
  },
  access: {
    // Only approved testimonials are public
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
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'google',
      options: [
        { label: 'Google', value: 'google' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Direct', value: 'direct' },
        { label: 'Yelp', value: 'yelp' },
        { label: 'Nextdoor', value: 'nextdoor' },
      ],
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Approve before making this testimonial publicly visible' },
    },
  ],
};
