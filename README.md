# Lộ Trình Hub — portfolio demo

Leadership backlog, roadmap, weekly brief, idea shaping, training, and adoption for a fictional demo bakery group. Not a live production system.

## What this proves (JD)

- AI backlog and roadmap with stages from inbox to released
- Leadership reporting with citation checks and baker / finance views
- Idea intake with confidence gate and accept-to-board flow
- Training modules and outlet adoption (Nguyễn Huệ 80%, Thảo Điền 50%, Phú Mỹ Hưng 0%)
- English and Vietnamese UI (default Vietnamese)
- Links to **Lò Ovenfloor** and **Quầy Tillbridge** demo URLs when configured

## Stack

- Next.js App Router (TypeScript), Tailwind CSS v4
- Prisma + Neon Postgres
- Vercel AI SDK (`generateObject` from `ai` + `@ai-sdk/openai`), Zod validation
- Tests: `tsx --test`

## Local setup

```powershell
cd projects/lotrinh-hub
copy .env.example .env
# Set DATABASE_URL and DIRECT_URL to your Neon (or local Postgres) strings
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

If Neon provides only one connection string, set both `DATABASE_URL` and `DIRECT_URL` to it.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm test` | Domain tests (citations, shape policy, access, adoption) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run build` | `prisma generate && next build` |

## Demo mode

With `AI_DEMO_MODE=auto` and no `OPENAI_API_KEY`, shaping and briefing use fixtures. The banner shows:

**Chế độ minh hoạ — chưa gọi mô hình**

## Public URLs

Set `NEXT_PUBLIC_OVENFLOOR_URL` and `NEXT_PUBLIC_TILLBRIDGE_URL` after sibling demos deploy. When empty, LT-01 and LT-02 show “Demo URL not set yet”.

Production URL (after deploy): see `DEMO_URL.txt`.

## Disclaimer (verbatim)

> Bản minh hoạ portfolio cho chương trình bánh và F&B giả lập — không phải hệ thống sản xuất thật. Dữ liệu là giả lập cho bếp demo tại TP.HCM.

See also `SECURITY.md` and `ARCHITECTURE.md`.
