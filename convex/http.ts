import { createClerkClient } from '@clerk/backend';
import { verifyWebhook } from '@clerk/backend/webhooks';
import { httpRouter } from 'convex/server';

import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

type ClerkUserData = {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: Array<{ id: string; email_address: string }>;
};

type ClerkInvitationData = {
  id?: string;
  email_address?: string;
};

type UserLifecycleType = 'user.created' | 'user.updated' | 'user.deleted';
type InvitationLifecycleType = 'invitation.accepted' | 'invitation.revoked';

function isUserLifecycleType(value: string): value is UserLifecycleType {
  return value === 'user.created' || value === 'user.updated' || value === 'user.deleted';
}

function isInvitationLifecycleType(value: string): value is InvitationLifecycleType {
  return value === 'invitation.accepted' || value === 'invitation.revoked';
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

const clerkLifecycle = httpAction(async (ctx, request) => {
  const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!signingSecret) return new Response('Webhook not configured', { status: 503 });

  const rawBody = await request.text();
  let event;
  try {
    event = await verifyWebhook(
      new Request(request.url, { method: request.method, headers: request.headers, body: rawBody }),
      { signingSecret },
    );
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  // Clerk documents instance invitation events even though some SDK webhook
  // unions lag those event names, so narrow the verified envelope explicitly.
  const eventType: string = event.type;
  const isUserLifecycle = isUserLifecycleType(eventType);
  const isInvitationLifecycle = isInvitationLifecycleType(eventType);
  if (!isUserLifecycle && !isInvitationLifecycle) {
    return new Response('Ignored', { status: 202 });
  }
  const providerOccurredAt = (event as { timestamp?: unknown }).timestamp;
  if (
    typeof providerOccurredAt !== 'number'
    || !Number.isFinite(providerOccurredAt)
    || providerOccurredAt < 0
  ) {
    return new Response('Missing Clerk event timestamp', { status: 400 });
  }
  const eventId = request.headers.get('svix-id') ?? (await sha256(rawBody));
  const payloadHash = await sha256(rawBody);
  const receivedAt = Date.now();

  if (isInvitationLifecycle) {
    const data = event.data as unknown as ClerkInvitationData;
    const clerkInvitationId = data.id?.trim();
    const emailAddress = data.email_address?.trim().toLowerCase();
    if (!clerkInvitationId || !emailAddress) {
      return new Response('Missing Clerk invitation identity', { status: 400 });
    }
    let acceptedClerkSubject: string | undefined;
    if (eventType === 'invitation.accepted') {
      const secretKey = process.env.CLERK_SECRET_KEY;
      if (!secretKey) {
        return new Response('Clerk identity lookup is not configured', { status: 503 });
      }
      const clerk = createClerkClient({ secretKey });
      const users = await clerk.users.getUserList({
        emailAddress: [emailAddress],
        limit: 2,
      });
      if (users.data.length !== 1) {
        return new Response('Accepted Clerk user is not uniquely resolvable', { status: 409 });
      }
      acceptedClerkSubject = users.data[0].id;
    }
    await ctx.runMutation(internal.invitationsInternal.applyVerifiedClerkLifecycle, {
      eventId,
      payloadHash,
      type: eventType,
      clerkInvitationId,
      emailAddress,
      acceptedClerkSubject,
      providerOccurredAt,
      receivedAt,
    });
    return new Response('Accepted', { status: 200 });
  }

  const data = event.data as unknown as ClerkUserData;
  const clerkSubject = data.id?.trim();
  if (!clerkSubject) return new Response('Missing Clerk user ID', { status: 400 });
  const primaryEmailAddress = data.email_addresses
    ?.find((email) => email.id === data.primary_email_address_id)
    ?.email_address.trim()
    .toLowerCase();
  const displayName = [data.first_name, data.last_name].filter(Boolean).join(' ').trim() || undefined;

  await ctx.runMutation(internal.users.applyVerifiedClerkLifecycle, {
    eventId,
    payloadHash,
    type: eventType,
    clerkSubject,
    primaryEmailAddress,
    displayName,
    providerOccurredAt,
    receivedAt,
  });
  return new Response('Accepted', { status: 200 });
});

const http = httpRouter();
http.route({ path: '/clerk/lifecycle', method: 'POST', handler: clerkLifecycle });

export default http;
