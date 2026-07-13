# Paid Media Pro — product and technical architecture

## Product promise

Paid Media Pro is a one-stop AI media buyer for small businesses and agencies. A customer connects accounts they already own, explains the business goal in ordinary language, and receives a cross-platform plan they can approve. The product preserves real paid-media terminology while translating every important metric, recommendation, and risk into plain English.

## Current implementation truth

- The web and iOS interfaces are functional product prototypes.
- All visible performance numbers are explicitly labeled sample data.
- Platform readiness is checked server-side from environment configuration.
- Google Ads and Meta OAuth, encrypted token storage, historical sync, and write execution are not implemented yet.
- The agent approval queue is local UI state; it cannot mutate an ad account.
- The previous simulated API connections, fabricated campaign launches, fictional leads, and card-entry checkout were removed from the primary workspace.

## Target architecture

1. Identity and tenancy
   - Auth provider with organizations, users, roles, and client workspaces.
   - Row-level tenant isolation on every persisted record.

2. Platform connections
   - Google Ads OAuth and approved developer token.
   - Meta Login for Business with Marketing API permissions and App Review.
   - Encrypted refresh tokens in a managed secrets store; never in the browser or iOS app.
   - Read-only scopes first, with write permissions requested only when the customer enables execution.

3. Normalized marketing data
   - Account, campaign, ad group/ad set, ad, creative, budget, conversion, and query schemas.
   - Immutable raw-ingestion tables plus a normalized reporting layer.
   - Explicit freshness, source, attribution window, currency, and timezone on every metric.

4. Measurement layer
   - Platform conversion actions plus GA4, CRM, ecommerce, call, and payment sources.
   - Reconciliation rules that separate platform-reported conversions from verified business outcomes.
   - No autonomous launch until the selected conversion goal is receiving valid data.

5. Agent system
   - Observation jobs produce evidence bundles; they never write.
   - A deterministic policy engine validates every proposed action against account guardrails.
   - An LLM explains and prioritizes evidence but cannot bypass policy.
   - Execution jobs are idempotent, versioned, reversible when the platform allows it, and fully audited.
   - Post-change monitors compare actual outcomes with the proposal hypothesis.

6. Guardrails
   - Account and campaign daily caps.
   - Maximum percentage budget change per 24 hours.
   - Protected campaigns and protected conversion actions.
   - Minimum evidence and learning-period thresholds.
   - Automatic stop on spend anomaly, tracking outage, API drift, or incomplete attribution.
   - Observe, approve, and bounded-autopilot modes.

7. API and job infrastructure
   - Next.js serves the customer product and authenticated API.
   - Durable Postgres stores tenant state, normalized metrics, recommendations, approvals, and audit events.
   - A queue processes sync, analysis, execution, and verification jobs with retries and dead-letter handling.
   - iOS consumes the same authenticated API and receives alerts through APNs; secrets remain server-side.

## Definition of “one click”

The user clicks “Continue with Google” or “Continue with Meta,” completes the platform-owned consent screen, selects an account, and returns to an automatic read-only audit. API credentials and developer approvals are configured once by Paid Media Pro, not by every customer. “One click” does not mean bypassing platform consent, business verification, billing, or measurement requirements.

## Release gates for real account execution

- OAuth callbacks, CSRF state, token encryption, rotation, and revocation tested.
- Google developer token and Meta App Review approved for production use.
- Tenant isolation and authorization tests pass.
- Conversion data is live and reconciled for the chosen business outcome.
- Every write operation has a dry-run diff, policy result, audit record, and idempotency key.
- Emergency global kill switch and per-workspace pause verified.
- Privacy policy, terms, data deletion, support, and App Store privacy disclosures are complete.
- Production monitoring, alerting, backups, and incident response are operational.
