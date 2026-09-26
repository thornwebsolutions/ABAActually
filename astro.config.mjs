// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // TODO: replace with the client's real domain once it's connected in Vercel
  site: 'https://abaactually.com',
  // Pages are prerendered to static HTML; only /api/contact runs as a Vercel function.
  adapter: vercel(),
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_FROM_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'ABA Actually Website <onboarding@resend.dev>',
      }),
    },
  },
});
