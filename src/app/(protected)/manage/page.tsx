'use client';

import { UserButton } from '@clerk/nextjs';
import { useQuery } from 'convex/react';

import { api } from '../../../../convex/_generated/api';

export default function ManagePage() {
  const companies = useQuery(api.crm.staffOverview);

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-start justify-between gap-6 border-b border-white/15 pb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF5A00]">
              Operator console
            </p>
            <h1 className="mt-3 text-4xl font-black">Staff foundation</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
              Clerk establishes this session. Convex verifies the active staff membership,
              company boundary, and current MFA claim before returning any operational data.
            </p>
          </div>
          <UserButton />
        </header>

        <section className="mt-10">
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-gray-400">
            Authorized companies
          </h2>

          {companies === undefined ? (
            <div className="mt-4 border border-white/15 bg-[#0B0B0D] p-8 text-sm text-gray-400">
              Verifying staff authorization...
            </div>
          ) : (
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {companies.map((company) => (
                <li
                  key={company.companyId}
                  className="border border-white/15 bg-[#0B0B0D] p-6"
                >
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#FF5A00]">
                    {company.role}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">{company.companyName}</h3>
                  <p className="mt-3 font-mono text-xs text-gray-500">{company.companyId}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10 border border-white/15 bg-[#0B0B0D] p-6">
          <h2 className="text-lg font-bold">Foundation status</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            CRM editing, media administration, and content workflows remain closed until their
            Convex authorization and audit paths are implemented in the corresponding migration
            nodes.
          </p>
        </section>
      </div>
    </main>
  );
}
