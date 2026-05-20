import { SchoolShell } from "@/layouts/SchoolShell";
import { CertificateGeneratePage } from "@/modules/certificates/pages/CertificateGeneratePage";

export function AdminCertificateGeneratePage() {
  return (
    <SchoolShell eyebrow="Certificates" title="Generate Certificates">
      <CertificateGeneratePage />
    </SchoolShell>
  );
}
