import type { CollectionConfig } from 'payload';

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    group: 'Content',
    defaultColumns: ['question', 'category', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user != null,
    update: ({ req }) => req.user != null,
    delete: ({ req }) => req.user != null,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Pricing', value: 'pricing' },
        { label: 'Process', value: 'process' },
        { label: 'Lead Safety', value: 'lead-safety' },
        { label: 'Scheduling', value: 'scheduling' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Public Sector', value: 'public-sector' },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first' },
    },
  ],
};
