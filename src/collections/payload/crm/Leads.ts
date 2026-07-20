import type { CollectionConfig } from 'payload';

/**
 * CRM: Leads collection
 *
 * Maps to the existing public.leads table via an updatable Postgres view
 * created in the payload schema by the migration:
 *   migrations/payload/0001_crm_views.sql
 *
 * Field names intentionally mirror the public.leads column names so Payload's
 * auto-generated Drizzle schema aligns with the view columns.
 *
 * Access: admin-only. No public read.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    group: 'CRM',
    defaultColumns: ['name', 'email', 'phone', 'status', 'market', 'submittedAt'],
    description: 'All inbound leads from website, ManyChat, and other sources.',
  },
  access: {
    read: ({ req }) => req.user != null,
    create: ({ req }) => req.user != null,
    update: ({ req }) => req.user != null,
    delete: ({ req }) => req.user != null,
  },
  fields: [
    // --- Contact ---
    { name: 'lead_id', type: 'text', admin: { readOnly: true, description: 'Auto-generated SKY-* ID' } },
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'text' },
    { name: 'city', type: 'text' },
    { name: 'project_address', type: 'text' },

    // --- Project ---
    {
      name: 'market',
      type: 'select',
      defaultValue: 'residential',
      options: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Public Sector', value: 'public-sector' },
      ],
    },
    { name: 'project_type', type: 'text' },
    { name: 'property_type', type: 'text' },
    { name: 'timeline', type: 'text' },
    { name: 'budget', type: 'text' },
    { name: 'contact_method', type: 'text' },
    { name: 'notes', type: 'textarea' },
    { name: 'photos_url', type: 'text' },
    { name: 'source', type: 'text' },

    // --- CRM Pipeline ---
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Estimate Sent', value: 'estimate_sent' },
        { label: 'Negotiating', value: 'negotiating' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
        { label: 'On Hold', value: 'on_hold' },
      ],
    },
    {
      name: 'is_test',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Mark test/demo leads to exclude from reporting' },
    },
    {
      name: 'next_follow_up_at',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'value_estimate',
      type: 'number',
      admin: { description: 'Estimated project value in USD' },
    },
    {
      name: 'assigned_to',
      type: 'text',
      admin: { description: 'Staff name or email responsible for this lead' },
    },

    // --- UTM / Attribution ---
    { name: 'utm_source', type: 'text', admin: { position: 'sidebar' } },
    { name: 'utm_medium', type: 'text', admin: { position: 'sidebar' } },
    { name: 'utm_campaign', type: 'text', admin: { position: 'sidebar' } },
    { name: 'page', type: 'text', admin: { position: 'sidebar', readOnly: true } },

    // --- Meta ---
    { name: 'submitted_at', type: 'date', admin: { position: 'sidebar', readOnly: true } },
  ],
};
