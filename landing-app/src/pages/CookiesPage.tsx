/**
 * Cookie Policy — explains the cookies we set and why.
 */

import { Seo } from '@/components/Seo';
import { PageShell } from '@/components/PageShell';
import { LegalSection, LegalList } from '@/components/LegalSection';

const LAST_UPDATED = 'September 4, 2026';

export function CookiesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Cookie Policy — EduPlexo School Management System',
    description:
      'EduPlexo cookie policy: how we use cookies and similar technologies in our school management system and ERP platform.',
    url: 'https://www.eduplexo.com/cookies',
    dateModified: '2026-09-04',
    publisher: {
      '@type': 'Organization',
      name: 'EduPlexo Technologies',
      url: 'https://www.eduplexo.com',
      logo: 'https://www.eduplexo.com/logo.jpeg',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.eduplexo.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Cookie Policy',
          item: 'https://www.eduplexo.com/cookies',
        },
      ],
    },
  };

  return (
    <PageShell
      eyebrow="Cookie Policy"
      title="How EduPlexo Uses Cookies."
      description="We use a small number of essential and preference cookies to keep you signed in, remember your settings, and maintain the security of our school management platform."
    >
      <Seo
        title="Cookie Policy — EduPlexo School Management System"
        description="EduPlexo cookie policy: how we use cookies and similar technologies in our school management system and ERP platform."
        keywords="EduPlexo cookie policy, school software cookies, education platform tracking, school ERP cookies"
        canonical="https://www.eduplexo.com/cookies"
        schema={[schema]}
      />
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200/80 text-sm text-slate-500">
        <span>Last updated: {LAST_UPDATED}</span>
        <span className="font-medium text-slate-700">Zero third-party advertising cookies</span>
      </div>

      <LegalSection number={1} title="What cookies are">
        <p>
          Cookies are small text files placed on your device when you visit a website. EduPlexo also
          uses similar browser storage technologies such as local storage and session storage tokens,
          which are treated under the scope of this policy.
        </p>
      </LegalSection>

      <LegalSection number={2} title="Categories we use">
        <LegalList
          items={[
            'Strictly necessary: Essential for authentication, session continuity, CSRF security, and multi-tenant routing. These cannot be disabled without breaking the platform.',
            'Preferences: Remembers UI choices such as active academic year, campus selection, language, and theme preferences.',
            'Operational analytics: Aggregated, de-identified usage telemetry that helps our engineering team measure latency, detect errors, and enhance platform responsiveness.',
          ]}
        />
      </LegalSection>

      <LegalSection number={3} title="Third-party cookies">
        <p>
          We do not allow third-party behavioral advertising cookies, data brokers, or marketing
          retargeting pixels on the EduPlexo platform. Any external domains setting cookies via
          EduPlexo are restricted strictly to essential core infrastructure providers (such as CDNs,
          fonts, and payment gateways).
        </p>
      </LegalSection>

      <LegalSection number={4} title="Managing cookies">
        <p>
          You can clear or block cookies at any time through your browser settings. Please note that
          disabling strictly necessary cookies will prevent you from signing in and using your EduPlexo
          account securely.
        </p>
      </LegalSection>

      <LegalSection number={5} title="Updates">
        <p>
          We may update this policy when our technology or statutory requirements evolve. Substantive
          updates will be reflected on this page with an updated modification date.
        </p>
      </LegalSection>

      <LegalSection number={6} title="Contact">
        <p>
          For questions about cookies or tracking technologies, please contact our compliance desk at{' '}
          <a
            href="mailto:plexotecnologies@gmail.com"
            className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
          >
            plexotecnologies@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </PageShell>
  );
}
