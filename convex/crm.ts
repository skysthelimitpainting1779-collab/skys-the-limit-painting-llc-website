import { v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { appendAuditFact } from './lib/audit';
import {
  requireActiveUser,
  requireCompanyMembership,
  requireProjectGrant,
} from './lib/authz';

const opportunityStage = v.union(
  v.literal('new'),
  v.literal('qualified'),
  v.literal('proposal'),
  v.literal('won'),
  v.literal('lost'),
);

/**
 * Minimal staff console contract. Clerk proves the session identity while this
 * query alone grants access using active Convex memberships and a fresh MFA
 * second-factor claim.
 */
export const staffOverview = query({
  args: {},
  returns: v.array(
    v.object({
      companyId: v.id('companies'),
      companyName: v.string(),
      role: v.union(v.literal('staff'), v.literal('admin')),
    }),
  ),
  handler: async (ctx) => {
    const user = await requireActiveUser(ctx);
    const memberships = await ctx.db
      .query('memberships')
      .withIndex('by_user_status', (q) => q.eq('userId', user._id).eq('status', 'active'))
      .take(25);
    const result: Array<{
      companyId: Id<'companies'>;
      companyName: string;
      role: 'staff' | 'admin';
    }> = [];
    for (const membership of memberships) {
      if (membership.role !== 'staff' && membership.role !== 'admin') continue;
      const access = await requireCompanyMembership(ctx, {
        companyId: membership.companyId,
        roles: ['staff', 'admin'],
      });
      result.push({
        companyId: access.company._id,
        companyName: access.company.name,
        role: access.membership.role as 'staff' | 'admin',
      });
    }
    if (result.length === 0) {
      throw new Error('An active staff or admin membership is required.');
    }
    return result;
  },
});

export const myProjects = query({
  args: {},
  returns: v.array(
    v.object({
      id: v.id('projects'),
      companyId: v.id('companies'),
      name: v.string(),
      status: v.union(v.literal('active'), v.literal('complete'), v.literal('archived')),
    }),
  ),
  handler: async (ctx) => {
    const user = await requireActiveUser(ctx);
    const memberships = await ctx.db
      .query('memberships')
      .withIndex('by_user_status', (q) => q.eq('userId', user._id).eq('status', 'active'))
      .take(25);
    const result: Array<{
      id: Id<'projects'>;
      companyId: Id<'companies'>;
      name: string;
      status: 'active' | 'complete' | 'archived';
    }> = [];
    for (const membership of memberships) {
      const projects = await ctx.db
        .query('projects')
        .withIndex('by_company_status', (q) =>
          q.eq('companyId', membership.companyId).eq('status', 'active'),
        )
        .take(100);
      for (const project of projects) {
        try {
          await requireProjectGrant(ctx, { projectId: project._id, permission: 'view' });
          result.push({
            id: project._id,
            companyId: project.companyId,
            name: project.name,
            status: project.status,
          });
        } catch {
          // Resource grants are deny-by-default; omit projects without one.
        }
      }
    }
    return result;
  },
});

export const listContacts = query({
  args: { companyId: v.id('companies'), limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      id: v.id('contacts'),
      name: v.string(),
      emailAddress: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      status: v.union(v.literal('active'), v.literal('archived')),
    }),
  ),
  handler: async (ctx, args) => {
    await requireCompanyMembership(ctx, {
      companyId: args.companyId,
      roles: ['staff', 'admin'],
    });
    const contacts = await ctx.db
      .query('contacts')
      .withIndex('by_company_status', (q) =>
        q.eq('companyId', args.companyId).eq('status', 'active'),
      )
      .take(Math.max(1, Math.min(args.limit ?? 50, 100)));
    return contacts.map((contact) => ({
      id: contact._id,
      name: contact.name,
      emailAddress: contact.emailAddress,
      phoneNumber: contact.phoneNumber,
      status: contact.status,
    }));
  },
});

export const updateOpportunityStage = mutation({
  args: {
    companyId: v.id('companies'),
    opportunityId: v.id('opportunities'),
    stage: opportunityStage,
    requestId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const access = await requireCompanyMembership(ctx, {
      companyId: args.companyId,
      roles: ['staff', 'admin'],
    });
    const opportunity = await ctx.db.get(args.opportunityId);
    if (!opportunity || opportunity.companyId !== args.companyId) {
      throw new Error('Opportunity access is denied.');
    }
    const occurredAt = Date.now();
    await ctx.db.patch(args.opportunityId, { stage: args.stage, updatedAt: occurredAt });
    await appendAuditFact(ctx, access, {
      action: 'opportunity.stage_updated',
      entityType: 'opportunity',
      entityId: args.opportunityId,
      requestId: args.requestId,
      metadata: { stage: args.stage },
      occurredAt,
    });
    return null;
  },
});
