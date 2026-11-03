# Security — Lộ Trình Hub

Portfolio demonstration only. Not production operator infrastructure.

## Controls implemented

- Server-side role checks on publish, accept, stage changes, and adoption name fields
- Colleague API responses omit person names; trainer and sponsor see names
- Weekly brief citations validated against work items in the database (`BAD_CITATION`)
- Idea shaper rejects invented money impact when the idea text had none (`INVENTED_IMPACT`)
- Audit rows for role switches, shape, accept, draft, publish, and training completion
- In-process rate limits on shape and draft routes (demo-grade)
- No public seed endpoint; fictional seed data only
- JSON errors without stack traces: `{ ok, error: { code, message_en, message_vi } }`
- Demo role cookie `demo_role` is httpOnly; not authentication

## Production gaps

- The role cookie is a demonstration of authorization checks, not SSO or MFA
- No field-level encryption, penetration test, or customer data processing agreement
- Rate limiting is single-instance, not multi-region
- External demo links are ordinary HTTPS URLs, not embedded admin sessions
- A real rollout would add SSO, audit export, backup policy, and data retention rules

## Secrets

Never commit `.env` or API keys. Use Vercel environment variables for `DATABASE_URL`, `DIRECT_URL`, and optional `OPENAI_API_KEY`.
