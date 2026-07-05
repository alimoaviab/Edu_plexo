import { AppIcon } from "shared/ui/AppIcon";
/**
 * Certificate View Page — Shows generated certificate with print.
 */
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Skeleton, DataState, Badge, Button } from "@/components/ui";
import { useSafeAsync } from "@/hooks/useSafeAsync";
import { serviceRequest } from "@/services/service-client";
import { useSchoolBranding } from "@/hooks/useSchoolBranding";
import { CERTIFICATE_TYPE_LABELS, type GeneratedCertificate } from "../types/certificate.types";
import { CertificateRenderer } from "../components/CertificateRenderer";

export function CertificateViewPage() {
  const { id } = useParams<{ id: string }>();
  const { schoolName, logoUrl } = useSchoolBranding();
  const { state, run } = useSafeAsync<GeneratedCertificate>();

  useEffect(() => {
    if (!id) return;
    void run(async () => {
      const result = await serviceRequest<any>("/api/certificates");
      if (!result.ok) throw new Error(result.error?.message || "Failed to load");
      const certs = Array.isArray(result.data) ? result.data : result.data?.data || [];
      const cert = certs.find((c: any) => c._id === id);
      if (!cert) throw new Error("Certificate not found");
      return cert;
    });
  }, [id, run]);

  useEffect(() => {
    if (state.status === "success") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("print") === "true") {
        setTimeout(() => window.print(), 500);
      }
    }
  }, [state.status]);

  const resolvedSchoolName = schoolName || "School";
  const resolvedLogoUrl = logoUrl;

  if (state.status === "loading" || state.status === "idle") {
    return <div className="space-y-4"><Skeleton className="h-20 w-full rounded-xl" /><Skeleton className="h-[500px] w-full rounded-xl" /></div>;
  }
  if (state.status === "error") {
    return <DataState variant="error" title="Certificate not found" message={state.error} />;
  }

  const cert = state.data!;
  
  const metadata = cert.metadata || {};
  
  let canvasJSON = "";
  if (metadata.border_style) {
    try {
      const parsed = JSON.parse(metadata.border_style);
      if (parsed && parsed.canvasJSON) {
        canvasJSON = parsed.canvasJSON;
      }
    } catch (e) {}
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 print:max-w-none print:w-full">
      <div className="flex items-center justify-between print:hidden">
        <Link to="/admin/certificates" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-all group">
          <AppIcon name="ArrowLeft" size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Certificates
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant={cert.status === "issued" ? "primary" : "secondary"}>{cert.status}</Badge>
          <Button variant="secondary" onClick={() => window.print()}>
            <AppIcon name="Printer" size={14} className="mr-1" />
            Print Certificate
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs print:hidden">
        <div><p className="text-[9px] font-bold text-slate-400 uppercase">Student</p><p className="font-bold text-slate-900">{cert.student_name}</p></div>
        <div><p className="text-[9px] font-bold text-slate-400 uppercase">Class</p><p className="font-bold text-slate-900">{cert.class_name}</p></div>
        <div><p className="text-[9px] font-bold text-slate-400 uppercase">Certificate #</p><p className="font-bold text-slate-900">{cert.certificate_no}</p></div>
        <div><p className="text-[9px] font-bold text-slate-400 uppercase">Issued</p><p className="font-bold text-slate-900">{new Date(cert.issue_date).toLocaleDateString()}</p></div>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-xl shadow-xl overflow-hidden print:border-0 print:shadow-none print:rounded-none aspect-[1.414/1] flex items-center justify-center">
        {canvasJSON ? (
          <CertificateRenderer canvasJSON={canvasJSON} metadata={metadata} />
        ) : (
          <div className="p-8 text-center text-slate-500">
            Certificate template missing design layout.
          </div>
        )}
      </div>
    </div>
  );
}
