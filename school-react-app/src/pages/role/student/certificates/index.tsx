import { AppIcon } from "shared/ui/AppIcon";
import { useEffect, useState } from "react";
import { Badge, Card, DataState, Skeleton } from "@/components/ui";
import { SchoolShell } from "@/layouts/SchoolShell";
import { useAuth } from "@/hooks/useAuth";
import { serviceRequest } from "@/services/service-client";

interface Certificate {
  _id: string;
  id?: string;
  template_name: string;
  type: string;
  student_name: string;
  issued_at: string;
  certificate_no: string;
  status: string;
  download_url?: string;
}

export function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchCertificates = async () => {
      try {
        // Fetch student's own certificates. The backend endpoint `/api/students/me/certificates`
        // should exist, or we use a general endpoint with appropriate filters.
        const res = await serviceRequest<any>("/api/students/me/certificates");
        if (mounted) {
          if (res.ok) {
            setCertificates(res.data?.data || res.data || []);
          } else {
            setError(res.error?.message || "Failed to load certificates");
          }
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError("An error occurred while fetching certificates");
          setLoading(false);
        }
      }
    };
    fetchCertificates();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <SchoolShell eyebrow="Student Portal" title="My Certificates">
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </SchoolShell>
    );
  }

  if (error) {
    return (
      <SchoolShell eyebrow="Student Portal" title="My Certificates">
        <DataState variant="error" title="Certificates unavailable" message={error} />
      </SchoolShell>
    );
  }

  return (
    <SchoolShell eyebrow="Student Portal" title="My Certificates">
      <div className="space-y-6">
        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-100">
            <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <AppIcon name="Award" className="h-6 w-6 text-slate-300" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No certificates yet</h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] text-center font-medium">
              Certificates issued by your school will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <Card key={cert._id || cert.id} className="p-5 space-y-3 border border-slate-200 hover:border-blue-200 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                      <AppIcon name="Award" className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{cert.template_name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{cert.type}</p>
                    </div>
                  </div>
                  <Badge variant={cert.status === "active" ? "success" : "gray"}>
                    {cert.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-[11px] text-slate-500">
                  <p><span className="font-semibold text-slate-700">Certificate No:</span> {cert.certificate_no}</p>
                  <p><span className="font-semibold text-slate-700">Issued:</span> {new Date(cert.issued_at).toLocaleDateString()}</p>
                </div>
                {cert.download_url && (
                  <a
                    href={cert.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold hover:bg-blue-100 transition-colors"
                  >
                    <AppIcon name="Download" className="h-3.5 w-3.5" />
                    Download
                  </a>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </SchoolShell>
  );
}
