/**
 * Privacy Policy — EduPlexo School Management System
 * Comprehensive data protection standards, multi-tenant isolation,
 * child privacy protections, and zero-sale data pledge.
 */

import { Seo } from '@/components/Seo';
import { PageShell } from '@/components/PageShell';
import { LegalSection, LegalList } from '@/components/LegalSection';

const LAST_UPDATED = 'September 4, 2026';

export function PrivacyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy — EduPlexo School Management System',
    description:
      'EduPlexo privacy policy: how we collect, use, store, and protect student and school data in our school management system and ERP platform.',
    url: 'https://www.eduplexo.com/privacy',
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
          name: 'Privacy Policy',
          item: 'https://www.eduplexo.com/privacy',
        },
      ],
    },
  };

  return (
    <PageShell
      eyebrow="Privacy Policy"
      title="Your School's Data, Handled with Care."
      description="How EduPlexo collects, uses, stores, and protects information across our school management system platform, mobile apps, and cloud services."
    >
      <Seo
        title="Privacy Policy — EduPlexo School Management System"
        description="EduPlexo privacy policy: how we collect, use, store, and protect student and school data in our school management system and ERP platform."
        keywords="EduPlexo privacy policy, school data privacy, student data protection, school ERP privacy, education data security, COPPA FERPA school software"
        canonical="https://www.eduplexo.com/privacy"
        schema={[schema]}
      />
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200/80 text-sm text-slate-500">
        <span>Last updated: {LAST_UPDATED}</span>
        <span className="font-medium text-slate-700">Strict zero-sale data guarantee</span>
      </div>

      <LegalSection number={1} title="The information we collect">
        <p>
          EduPlexo collects only information necessary to deliver, operate, and secure our school
          management system and ERP platform. Data collected across the platform falls into three
          distinct categories:
        </p>
        <LegalList
          items={[
            'Institutional & administrative profiles: Information provided when registering a school tenant, including school name, address, contact numbers, administrator names, staff roles, and encrypted authentication credentials.',
            'Student educational records: Data entered by authorized school staff and parents, including student names, admission numbers, roll numbers, grade/class placement, attendance logs, academic examination grades, report cards, fee challan records, and emergency guardian contacts.',
            'Parent & guardian details: Contact names, mobile numbers, email addresses, residential information, and communication preferences provided to facilitate school-to-home announcements and fee notifications.',
            'Technical & diagnostic metadata: Device type, browser characteristics, IP addresses, session timestamps, and system error telemetry used exclusively for authentication security, rate limiting, and system reliability monitoring.',
          ]}
        />
      </LegalSection>

      <LegalSection number={2} title="How we use information">
        <p>
          We process institutional and personal information strictly on behalf of the customer school
          to fulfill our educational service commitments:
        </p>
        <LegalList
          items={[
            'Deliver core school operations: Authenticate users, enforce granular role-based access control (RBAC), calculate grades, record daily student attendance, and generate official academic transcripts.',
            'School communication: Transmit attendance notifications, emergency broadcasts, academic circulars, and fee invoices to parents via SMS, WhatsApp, push notifications, and email as configured by the school.',
            'Tenant-isolated AI features: Provide educators with AI-assisted tools (such as class progress summaries and Edubot administrative query support) operating solely within the school’s private tenant data boundary.',
            'Platform security & audit trails: Maintain immutable security audit logs to track unauthorized access attempts, protect against fraud, and uphold system integrity.',
            'Product reliability: Utilize anonymized, de-identified performance metrics to optimize server response times, reduce database latency, and resolve technical bugs.',
          ]}
        />
      </LegalSection>

      <LegalSection number={3} title="How information is shared">
        <p>
          <strong>EduPlexo never sells, rents, or commercializes personal or student data.</strong> We
          do not display third-party advertisements on the platform, and we never build behavioral
          advertising profiles based on student activity.
        </p>
        <p>
          Information is shared only under strict operational conditions:
        </p>
        <LegalList
          items={[
            'Essential infrastructure subprocessors: Data is stored and processed with vetted cloud hosting, database, and messaging providers (such as cloud server infrastructure, SMS gateways, and transactional email providers). Every vendor is bound by rigorous Data Processing Agreements (DPAs) and confidentiality obligations.',
            'School-directed third parties: Where a school explicitly enables an external integration (such as an authorized local payment gateway or biometric attendance hardware), data is transmitted solely at the school’s instruction.',
            'Legal compliance: We will disclose information only when required by applicable law, valid judicial subpoena, or binding law enforcement request, with prompt notice provided to the affected school where legally permissible.',
            'Institutional safety: In urgent circumstances to protect the vital physical safety or wellbeing of a student, staff member, or the general public.',
          ]}
        />
      </LegalSection>

      <LegalSection number={4} title="Tenant isolation & retention">
        <p>
          EduPlexo is built on a multi-tenant cloud architecture engineered with cryptographic and
          database-level isolation:
        </p>
        <LegalList
          items={[
            'Logical isolation: Every query, table access, and cache partition enforces PostgreSQL Row-Level Security (RLS) linked to your school’s unique tenant identifier. No institution can view, query, or inadvertently access records belonging to another school.',
            'Active retention: We retain institutional records for as long as your school maintains an active subscription or as mandated by regional educational regulatory record-retention requirements.',
            'Archival grace period: Upon subscription termination, records are preserved in a secure, exportable state for thirty (30) calendar days to permit complete administrative offboarding.',
            'Permanent erasure: Following the 30-day grace period, all institutional records, student files, and user credentials are cryptographically and permanently purged from production databases and scheduled backup lifecycles.',
          ]}
        />
      </LegalSection>

      <LegalSection number={5} title="Security">
        <p>
          Protecting educational records requires defense-in-depth security standards. We employ
          industry-standard technical and organizational safeguards:
        </p>
        <LegalList
          items={[
            'Data encryption: All data in transit is protected using modern TLS 1.3 protocols. All database storage, document uploads, and automated backups are encrypted at rest using AES-256 encryption.',
            'Role-based access control (RBAC): Strict least-privilege principles are enforced. Teachers only see assigned classrooms, parents only access their own children’s records, and accountants are restricted to financial modules.',
            'Multi-factor authentication (MFA): Available and strongly encouraged for all administrative and faculty accounts to protect against credential theft.',
            'Continuous monitoring: 24/7 automated vulnerability scanning, rate-limiting against brute force attacks, and comprehensive audit logs recording administrative modifications.',
          ]}
        />
      </LegalSection>

      <LegalSection number={6} title="Your rights">
        <p>
          EduPlexo honors data protection principles granting users and institutions control over their
          personal information:
        </p>
        <LegalList
          items={[
            'Institutional data control: School administrators maintain complete authority to review, update, rectify, export, or delete user accounts and student records within their school instance.',
            'Parental review rights: Parents and legal guardians have the right to inspect their child’s academic and personal records and request corrections by contacting their school administration.',
            'Data portability: School owners can request a complete data export in standardized, structured formats (CSV, JSON, PDF) at any time during active service.',
            'Right to erasure: Upon written authorization from the school, EduPlexo will permanently purge designated records from active storage, subject to statutory record-keeping constraints.',
          ]}
        />
      </LegalSection>

      <LegalSection number={7} title="Children's privacy">
        <p>
          The protection of minor students is central to everything we build at EduPlexo:
        </p>
        <LegalList
          items={[
            'Institutional consent: Student profiles are created and managed directly by the educational institution and registered parents/guardians acting in an authorized capacity.',
            'Regulatory alignment: Our policies and technical controls align with internationally recognized child privacy standards (including COPPA and FERPA principles) and Pakistan’s Prevention of Electronic Crimes Act (PECA).',
            'No commercial profiling: We never serve advertisements to students, never collect non-essential personal identifiers from minors, and never use student communications for commercial profiling.',
            'Parental inquiries: Parents wishing to access or delete student data should contact their school administrator directly, or contact our privacy desk for assistance.',
          ]}
        />
      </LegalSection>

      <LegalSection number={8} title="Contact us">
        <p>
          For privacy inquiries, data protection agreements, security notifications, or requests to
          exercise your data rights, please contact our Data Protection Office:
        </p>
        <div className="mt-4 p-5 rounded-xl bg-slate-100/70 border border-slate-200/80 text-slate-700">
          <p className="font-semibold text-slate-900 mb-1">EduPlexo Technologies — Data Protection Office</p>
          <p className="text-sm">
            Email:{' '}
            <a
              href="mailto:plexotecnologies@gmail.com"
              className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2"
            >
              plexotecnologies@gmail.com
            </a>
          </p>
          <p className="text-sm mt-1">Official website: https://www.eduplexo.com</p>
          <p className="text-xs text-slate-500 mt-2">
            Data subject requests and privacy concerns are reviewed promptly, typically within 24 to 48 business hours.
          </p>
        </div>
      </LegalSection>
    </PageShell>
  );
}
