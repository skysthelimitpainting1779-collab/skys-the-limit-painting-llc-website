import type { CollectionConfig } from 'payload';

export const Admins: CollectionConfig = {
  slug: 'admins',
  auth: {
    tokenExpiration: 7200, // 2 hours
    cookies: {
      sameSite: 'Strict',
      secure: true,
    },
  },
  admin: {
    useAsTitle: 'email',
    group: 'System',
  },
  access: {
    // Only admins can read/create/update/delete other admin accounts
    read: ({ req }) => req.user != null,
    create: ({ req }) => req.user != null,
    update: ({ req }) => req.user != null,
    delete: ({ req }) => req.user != null,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'admin',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Super Admin', value: 'super_admin' },
      ],
    },
  ],
};
