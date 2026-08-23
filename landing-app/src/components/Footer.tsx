/**
 * Footer.
 *
 * Premium SaaS structure:
 *  - Brand area: logo, short product description, contact icons (WhatsApp + Email)
 *  - Product:    Features / Platform / Security / Pricing  (smooth-scroll on home)
 *  - Company:    About EduPlexo, Careers, Contact, Blog
 *  - Legal:      Privacy Policy, Terms of Service, Cookie Policy
 *
 * Internal `#section` anchors smooth-scroll on the home route and gracefully
 * fall back to '/'-prefixed navigation on sub-pages (about, privacy, etc.).
 */
// ksjhanksasm
import { Link, useNavigate } from 'react-router-dom';
import { AppIcon } from "shared/ui/AppIcon";

import { makeAnchorClickHandler } from '@/lib/scroll-to';

const PRODUCT_LINKS = [
  { label: 'Features', hash: '#features' },
  { label: 'Platform', hash: '#platform' },
  { label: 'Security', hash: '#security' },
  { label: 'Pricing', hash: '#pricing' },
];

const COMPANY_LINKS = [
  { label: 'About EduPlexo', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Blog', to: '/blog' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Cookie Policy', to: '/cookies' },
];

const WHATSAPP_URL = 'https://wa.me/923064944326';
const EMAIL_URL = 'mailto:plexotecnologies@gmail.com';

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-850 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          {/* ── Brand area ─────────────────────────────────────────────── */}
          <div className="col-span-2 lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-5">
              <span className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 shadow-sm flex-shrink-0">
                <img
                  src="/logo.jpeg"
                  alt="EduPlexo — School Management System Logo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="36"
                  height="36"
                />
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                EduPlexo
              </span>
            </Link>

            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mb-7 font-medium">
              EduPlexo is the AI-powered school management system and school ERP
              platform trusted by 50+ schools in Pakistan and worldwide. Unify
              admin, academics, and parent communication into one premium platform.
            </p>

            <div className="flex items-center gap-3">
              <SocialIconLink
                href={WHATSAPP_URL}
                label="Contact EduPlexo on WhatsApp"
                icon={<AppIcon name="MessageCircle" className="w-4 h-4" />}
              />
              <SocialIconLink
                href={EMAIL_URL}
                label="Email EduPlexo Support"
                icon={<AppIcon name="Mail" className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* ── Product links ──────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm tracking-wide">
              Product
            </h3>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.hash}
                    onClick={makeAnchorClickHandler(link.hash, navigate)}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company links ─────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm tracking-wide">
              Company
            </h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal links ───────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm tracking-wide">
              Legal
            </h3>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────── */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} EduPlexo Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/sitemap.xml" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
              Sitemap
            </Link>
            <span>EduPlexo — School ERP Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialIconLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function SocialIconLink({ href, label, icon }: SocialIconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm hover:text-blue-600 dark:hover:text-sky-400 hover:ring-blue-200 dark:hover:ring-sky-500/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {icon}
    </a>
  );
}
