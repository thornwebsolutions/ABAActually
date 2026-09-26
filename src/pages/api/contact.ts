import type { APIRoute } from 'astro';
import { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } from 'astro:env/server';
import { Resend } from 'resend';

// Runs on demand as a Vercel function; everything else on the site is static.
export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = ['Parent or caregiver', 'Professional', 'Other'];

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const POST: APIRoute = async ({ request, redirect }) => {
  const wantsJson = request.headers.get('accept')?.includes('application/json');
  const respond = (status: number, ok: boolean, message: string) =>
    wantsJson
      ? Response.json({ ok, message }, { status })
      : redirect(`/contact?status=${ok ? 'sent' : 'error'}#contact-form`, 303);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return respond(400, false, 'Invalid form submission.');
  }

  const field = (key: string) => String(form.get(key) ?? '').trim();
  const name = field('name');
  const email = field('email');
  const role = field('role');
  const message = field('message');

  // Honeypot: real visitors never see or fill this field. Pretend success so bots move on.
  if (field('company')) return respond(200, true, 'Thanks!');

  if (!name || name.length > 120) return respond(400, false, 'Please enter your name.');
  if (!EMAIL_RE.test(email) || email.length > 200) return respond(400, false, 'Please enter a valid email address.');
  if (!message || message.length > 5000) return respond(400, false, 'Please enter a message (up to 5,000 characters).');
  const safeRole = ROLES.includes(role) ? role : 'Not specified';

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error('Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not configured.');
    return respond(500, false, 'Our contact form is not quite set up yet. Please email us directly.');
  }

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: CONTACT_FROM_EMAIL,
    to: CONTACT_TO_EMAIL.split(',').map((s) => s.trim()),
    replyTo: email,
    subject: `New website message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nI am a: ${safeRole}\n\n${message}`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#494346;line-height:1.6">
        <h2 style="color:#C71E65;margin:0 0 16px">New message from the ABA Actually website</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}<br>
        <strong>Email:</strong> ${escapeHtml(email)}<br>
        <strong>I am a:</strong> ${escapeHtml(safeRole)}</p>
        <p style="white-space:pre-wrap;background:#F4E3E8;padding:16px;border-radius:8px">${escapeHtml(message)}</p>
        <p style="font-size:12px;color:#888">Reply to this email to respond directly to ${escapeHtml(name)}.</p>
      </div>`,
  });

  if (error) {
    console.error('Contact form: Resend error', error);
    return respond(502, false, 'Something went wrong sending your message. Please try again or email us directly.');
  }

  return respond(200, true, "Thanks for reaching out! We'll get back to you soon.");
};
