---
id: dec_mn_compliance
name: "Architectural Decision: Minnesota Contractor & Legal Compliance"
type: policy
description: "Establishes mandatory public citation standards for contractor registration number and workers' compensation exemption."
tags: [legal, compliance, minnesota]
references: [architectural_decisions]
---

# Architectural Decision: Minnesota Contractor & Legal Compliance

**Status**: Active  
**Domain**: Legal & Public Content Disclosure

## Policy Rule

1. **Registration Display**: The official Minnesota Contractor Registration ID **`IR816596`** must appear on all public contractor references. No marketing claims of "Licensed" or "Bonded" are allowed unless explicitly accompanied by this registration ID.
2. **Workers' Comp Disclosure**: Under Minnesota Statute Section 176.041, the owner-operator has zero payroll and is exempt from Workers' Compensation. This exempt status must be preserved in all public pricing, capabilities, and insurance references.

## Rationale

Ensures compliance with Minnesota Department of Labor and Industry (DLI) advertising standards. Under MN Statute 326B, residential building contractors and painters must disclose their registration/license clearly in all promotional materials. Preserving the exact workers' compensation statement avoids public liability and maintains regulatory transparency.

## Enforcement Locations

- Landing Page footer/header components
- Services views and contact forms
- Control plane dashboard headers/footers
- Documentation and public marketing collateral
