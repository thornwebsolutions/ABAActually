# ABA Actually

Marketing site for ABA Actually, built with [Astro](https://astro.build) and deployed on [Vercel](https://vercel.com).

Pages: Home, About, Services (coming soon), Contact. All pages are prerendered to static HTML. Only `/api/contact`
runs as a Vercel serverless function, which sends contact form submissions through [Resend](https://resend.com).

## Local development

```sh
npm install
cp .env.example .env   # fill in the Resend values to test the contact form
npm run dev            # http://localhost:4321
npm run build          # production build (outputs .vercel/output)
```

## Environment variables

| Name | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | From resend.com → API Keys |
| `CONTACT_TO_EMAIL` | yes | Inbox that receives submissions (comma-separate for several) |
| `CONTACT_FROM_EMAIL` | for launch | e.g. `ABA Actually <hello@abaactually.com>`. The domain must be verified in Resend. The default `onboarding@resend.dev` only delivers to the Resend account owner, which is fine for testing. |

Without these, the site still builds and the form shows a friendly "not set up yet" message.

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel. The framework preset is detected as Astro automatically.
2. Add the environment variables above under **Project → Settings → Environment Variables**.
3. Connect the custom domain, and update `site` in `astro.config.mjs` to match (used for canonical/OG URLs).

## Editing content

- Contact email and social links: `src/config.ts`
- Brand colors, fonts, and shared styles: `src/styles/global.css`
- Pages: `src/pages/*.astro`
- Images: `src/assets/` (optimized automatically at build time)
