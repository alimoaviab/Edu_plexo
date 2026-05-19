import { SchoolShell } from "@/layouts/SchoolShell";
import { CertificateListPage } from "@/modules/certificates/pages/CertificateListPage";

export function AdminCertificatesPage() {
  return (
    <SchoolShell eyebrow="Operations" title="Certificates">
      <CertificateListPage />
    </SchoolShell>
  );
}
