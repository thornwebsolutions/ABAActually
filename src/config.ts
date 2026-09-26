// Central place for site-wide details. Fill in the TODOs before launch.
export const SITE = {
  name: 'ABA Actually',
  tagline: 'Made to make ABA actually make sense.',
  description:
    'Clear, practical, evidence-based information about autism and Applied Behavior Analysis — created by BCBAs, written for parents.',
  // TODO: confirm the client's public email address
  email: 'hello@abaactually.com',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/abaactually/', icon: 'instagram' },
    { label: 'Facebook', href: 'https://www.facebook.com/share/1Ez3Q24kJT/?mibextid=wwXIfr', icon: 'facebook' },
  ],
} as const;

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
] as const;
