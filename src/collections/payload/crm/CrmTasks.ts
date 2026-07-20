import type { CollectionConfig } from 'payload';

/**
 * CRM: Tasks / Follow-ups
 *
 * Maps to the existing public.crm_tasks table via an updatable view in the
 * payload schema. Replaces HubSpot tasks.
 */
export const CrmTasks: CollectionConfig = {
  slug: 'crm-tasks',
  admin: {
    useAsTitle: 'title',
    group: 'CRM',
    defaultColumns: ['title', 'type', 'dueAt', 'status', 'updatedAt'],
    description: 'Follow-ups, call-backs, on-site visits, and action items.',
  },
  access: {
    read: ({ req }) => req.user != null,
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
      name: 'type',
      type: 'select',
      defaultValue: 'call',
      options: [
        { label: 'Call', value: 'call' },
        { label: 'Email', value: 'email' },
        { label: 'Text', value: 'text' },
        { label: 'On-site Visit', value: 'onsite' },
        { label: 'To-do', value: 'todo' },
      ],
    },
    {
      name: 'dueAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Snoozed', value: 'snoozed' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    // Relations
    {
      name: 'lead',
      type: 'relationship',
      relationTo: 'leads',
      admin: { description: 'Associated lead record' },
    },
    {
      name: 'assignedTo',
      type: 'text',
      admin: { description: 'Staff member responsible' },
    },
  ],
};
