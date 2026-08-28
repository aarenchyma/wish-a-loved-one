# Wish a Loved One

Send a personalized wish for any occasion — as a shareable link, a scannable QR code, or straight to their inbox. No app required for the recipient to open it.

**Live:** [wish-a-loved-one.com](https://wish-a-loved-one.com)

## What it does

- Write a message (and optionally a short video) for someone
- Pick an occasion-themed, animated design — Valentine, Birthday, Anniversary, Graduation, Wedding, New Year
- Preview the finished page before paying
- Pay via Paystack
- Get a unique link and/or QR code to share, with an option to email it directly to the recipient

## Pricing

| Tier | Price | Includes |
|------|-------|----------|
| Text | ₦250 | Message + link or QR code |
| Text + Video | ₦500 | Everything in Text, plus a personal video |

## Tech stack

- **Framework:** Next.js (App Router) + TypeScript
- **Database:** MongoDB (Mongoose)
- **Payments:** Paystack
- **Media storage:** Cloudinary (signed client-side video uploads)
- **Email:** Resend
- **QR codes:** generated server-side with `qrcode`
- **Animations:** Framer Motion
- **Hosting:** Vercel

## Getting started

```bash
git clone https://github.com/aarenchyma/wish-a-loved-one.git
cd wish-a-loved-one
npm install
```

Create a `.env.local` file in the project root:

```env
MONGODB_URI=
PAYSTACK_SECRET_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/                  # routes (landing, create, [slug], confirmation, API routes)
├── components/
│   ├── forms/            # wish creation form, template selector, video upload
│   ├── templates/        # occasion-themed wish page designs
│   └── ui/                # shared UI primitives
├── lib/                  # db, paystack, cloudinary, email, qrcode, slug helpers
├── models/                # Mongoose schemas
├── config/                # env + pricing config
└── types/                  # shared TypeScript types
```

## Webhook setup

Payments are confirmed via a Paystack webhook. In the Paystack dashboard, register:

```
https://your-domain.com/api/paystack/webhook
```

under **Settings → API Keys & Webhooks**.

## License

Private project — all rights reserved.
