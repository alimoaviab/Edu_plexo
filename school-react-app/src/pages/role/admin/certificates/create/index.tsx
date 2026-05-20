import { SchoolShell } from "@/layouts/SchoolShell";
import { CertificateCreatePage } from "@/modules/certificates/pages/CertificateCreatePage";

export function AdminCertificateCreatePage() {
  return (
    <SchoolShell eyebrow="Certificates" title="Create Template">
      <CertificateCreatePage />
    </SchoolShell>
  );
}
