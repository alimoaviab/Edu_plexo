/**
 * Terms of Service — EduPlexo School Management System
 * Comprehensive legal terms governing platform usage, institutional authority,
 * student data processing, AI features, billing, SLAs, and liability.
 */

import { Seo } from '@/components/Seo';
import { PageShell } from '@/components/PageShell';
import { LegalSection, LegalList } from '@/components/LegalSection';

const LAST_UPDATED = 'September 4, 2026';

export function TermsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Service — EduPlexo School Management System',
    description:
      'Terms of service for EduPlexo school management system and school ERP platform. Governing your use of our education technology services.',
    url: 'https://www.eduplexo.com/terms',
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
          name: 'Terms of Service',
          item: 'https://www.eduplexo.com/terms',
        },
      ],
    },
  };

  return (
    <PageShell
      eyebrow="Terms of Service"
      title="The Agreement Between You and EduPlexo."
      description="These terms govern your use of the EduPlexo school management system platform, websites, mobile applications, and related education technology services."
    >
      <Seo
        title="Terms of Service — EduPlexo School Management System"
        description="Terms of service for EduPlexo school management system and school ERP platform. Governing your use of our education technology services."
        keywords="EduPlexo terms of service, school management system terms, school ERP agreement, education software terms, school data processing terms"
        canonical="https://www.eduplexo.com/terms"
        schema={[schema]}
      />
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200/80 text-sm text-slate-500">
        <span>Last updated: {LAST_UPDATED}</span>
        <span className="font-medium text-slate-700">Effective across all EduPlexo deployments</span>
      </div>

      <LegalSection number={1} title="Acceptance of terms">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between
          your educational institution (&ldquo;Customer,&rdquo; &ldquo;School,&rdquo; &ldquo;You,&rdquo;
          or &ldquo;Your&rdquo;) and EduPlexo Technologies (&ldquo;EduPlexo,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
        </p>
        <p>
          By creating an account, accessing, or using the EduPlexo school management system, school
          ERP platform, web applications, mobile apps, or associated APIs (collectively, the &ldquo;Services&rdquo;),
          you accept and agree to be bound by these Terms and our Privacy Policy.
        </p>
        <p>
          If you are registering or executing this agreement on behalf of a school, educational trust,
          college, or multi-campus network, you confirm, represent, and warrant that you possess the
          legal and institutional authority to bind that entity to these Terms. If you do not have such
          authority, or if you do not agree to all provisions contained herein, you must immediately
          refrain from accessing or using the Services.
        </p>
      </LegalSection>

      <LegalSection number={2} title="Accounts & access">
        <p>
          EduPlexo provides role-based workspaces tailored for school administrators, owners,
          principals, teachers, accountants, staff, parents/guardians, and students. Authorized
          institutional usage is governed by the following obligations:
        </p>
        <LegalList
          items={[
            'Accurate registration: Provide authentic, accurate, and current institutional and administrative information during account provisioning.',
            'Institutional responsibility: School administrators are exclusively responsible for provisioning, managing, and maintaining access credentials for all sub-accounts (including faculty, staff, parents, and students) assigned within their tenant instance.',
            'Credential hygiene: You are responsible for safeguarding login credentials, passwords, two-factor authentication keys, and API tokens. Account sharing across multiple individuals is strictly prohibited.',
            'Incident notification: You must notify EduPlexo immediately at plexotecnologies@gmail.com upon discovering or suspecting any unauthorized access, compromised credentials, or security anomalies within your institutional tenant.',
            'Administrative governance: Institutional owners and principals retain full rights to revoke, suspend, or reassign access permissions for any user account associated with their school tenant.',
          ]}
        />
      </LegalSection>

      <LegalSection number={3} title="Acceptable use">
        <p>
          You agree to utilize the Services strictly for legitimate academic, operational, and
          educational administrative purposes in compliance with all applicable laws and regulations.
          You agree not to misuse or facilitate misuse of the platform. Prohibited activities include:
        </p>
        <LegalList
          items={[
            'Security breaches: Probing, scanning, or testing the vulnerability of EduPlexo systems, networks, or multi-tenant database boundaries without explicit written authorization.',
            'Reverse engineering: Decompiling, reverse-engineering, disassembling, or attempting to discover the underlying source code or proprietary architecture of the platform.',
            'Unlawful data: Uploading, storing, or transmitting malicious code, defamatory material, counterfeit records, or content that infringes upon the intellectual property or privacy rights of any party.',
            'Harassment & child protection: Utilizing communication modules (SMS, WhatsApp integration, or notifications) to harass, threaten, spam, or transmit inappropriate content to students, guardians, or staff members.',
            'System disruption: Engaging in automated scraping, denial-of-service activities, or placing excessive loads on our cloud infrastructure that compromises system stability for other educational institutions.',
          ]}
        />
        <p>
          EduPlexo reserves the right to suspend or terminate accounts that engage in willful violations
          of this Acceptable Use Policy to safeguard student safety and infrastructure integrity.
        </p>
      </LegalSection>

      <LegalSection number={4} title="Subscriptions & billing">
        <p>
          Access to EduPlexo is provided on a recurring subscription basis structured around student
          enrollment tiers and selected feature packages:
        </p>
        <LegalList
          items={[
            'Billing cycles: Paid subscriptions renew automatically on the billing cadence selected at checkout (monthly, quarterly, or annually) unless cancelled prior to the renewal date.',
            'Payment terms: Invoices are payable in Pakistani Rupees (PKR) or specified contractual currency via authorized bank transfer, card, or approved payment gateways by the due date specified on the invoice.',
            'Non-refundable fees: Subscription fees are non-refundable except where explicitly required by mandatory consumer protection laws or agreed under formal enterprise service level commitments.',
            'Transparent pricing notice: We provide at least 30 calendar days written advance notice via email or administrative dashboard alerts prior to any pricing change taking effect on an existing active subscription.',
            'Account suspension: Failure to settle outstanding subscription fees within the contractual grace period may result in restricted functionality or temporary suspension of administrative access.',
          ]}
        />
      </LegalSection>

      <LegalSection number={5} title="Customer data ownership">
        <p>
          <strong>Your school owns its data.</strong> EduPlexo does not claim any ownership rights
          over student records, teacher records, attendance logs, exam grades, curriculum plans,
          financial vouchers, or institutional documentation entered into the system (&ldquo;Customer Data&rdquo;).
        </p>
        <LegalList
          items={[
            'Data processor role: EduPlexo acts solely as a data processor on behalf of the school, handling records exclusively to deliver and maintain the Services as instructed by the school.',
            'No public AI model training: EduPlexo utilizes artificial intelligence (including our Edubot assistant and automated analytics) within isolated tenant boundaries. We never use your school’s proprietary data or student records to train public or foundation AI models.',
            'Export rights: At any point during your active subscription, authorized school administrators may export your institution’s complete records in standard formats (CSV, JSON, PDF).',
            'Post-termination retention: Upon contract expiration or termination, you have a 30-day grace period to export your records before data is permanently and securely purged in accordance with our data-processing terms.',
          ]}
        />
      </LegalSection>

      <LegalSection number={6} title="Service availability">
        <p>
          We understand that schools rely on EduPlexo every school day for attendance, grading, fee
          processing, and parent communication:
        </p>
        <LegalList
          items={[
            'Uptime objective: We target 99.9% monthly availability for core platform services, supported by enterprise cloud infrastructure, automated failover, and continuous health monitoring.',
            'Scheduled maintenance: Routine system maintenance and upgrades are conducted during off-peak hours (typically late nights or weekends) with advance in-app notification to minimize operational disruption.',
            'Exclusions: EduPlexo is not responsible for downtime or service degradation resulting from upstream telecommunication failures, nationwide internet throttling, customer hardware or browser incompatibilities, or force majeure events beyond our reasonable control.',
          ]}
        />
      </LegalSection>

      <LegalSection number={7} title="Limitation of liability">
        <p>
          To the maximum extent permitted by applicable law:
        </p>
        <LegalList
          items={[
            'Exclusion of indirect damages: EduPlexo and its officers, directors, employees, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, loss of profits, educational disruption, or reputational damage.',
            'Aggregate liability cap: EduPlexo’s total cumulative liability arising out of or related to these Terms or your use of the Services, whether in contract, tort, or otherwise, is strictly limited to the total fees paid by your institution to EduPlexo in the twelve (12) months preceding the event giving rise to the claim.',
            'Educational decisions: School administrators and educators retain sole discretion and responsibility for academic evaluations, grading policies, disciplinary decisions, and fee schedules managed through the platform.',
          ]}
        />
      </LegalSection>

      <LegalSection number={8} title="Termination">
        <p>
          Either party may terminate the contractual relationship under the following conditions:
        </p>
        <LegalList
          items={[
            'Cancellation by school: You may cancel your subscription at any time via your administrator settings or by notifying support. Cancellation takes effect at the end of the current paid billing period.',
            'Termination for cause: We may suspend or terminate platform access if your institution materially breaches these Terms and fails to cure such breach within 14 days of receiving written notice, or immediately if required by law or to prevent imminent harm to the system.',
            'Offboarding grace period: Following termination, your account enters a 30-day archival window allowing authorized administrators to export all institutional records prior to permanent database purging.',
            'Survival: Provisions concerning customer data ownership, intellectual property, confidentiality, limitations of liability, and dispute resolution shall survive termination.',
          ]}
        />
      </LegalSection>

      <LegalSection number={9} title="Updates to these terms">
        <p>
          EduPlexo evolves continuously with new features, enhanced security standards, and regulatory
          requirements. We may update these Terms of Service from time to time.
        </p>
        <p>
          Significant or material changes will be communicated at least 15 days in advance via registered
          administrator email or a prominent banner within the school dashboard. The &ldquo;Last updated&rdquo;
          date at the top of this document indicates when changes were last implemented. Continued access
          or use of the platform following the effective date constitutes your binding acceptance of the
          revised Terms.
        </p>
      </LegalSection>

      <LegalSection number={10} title="Contact">
        <p>
          For legal inquiries, contractual notices, data processing agreements, or questions regarding
          these Terms of Service, please contact our legal and compliance desk:
        </p>
        <div className="mt-4 p-5 rounded-xl bg-slate-100/70 border border-slate-200/80 text-slate-700">
          <p className="font-semibold text-slate-900 mb-1">EduPlexo Technologies — Legal &amp; Compliance</p>
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
            Inquiries are processed in the order received, typically within 24 to 48 business hours.
          </p>
        </div>
      </LegalSection>
    </PageShell>
  );
}
