import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppIcon } from "shared/ui/AppIcon";
import { StatCardCompact, Skeleton, DataState, EntityCard, EntityGrid, ConfirmModal } from "@/components/ui";
import { useCertificateTemplates } from "@/modules/certificates/hooks/useCertificates";
import { CERTIFICATE_TYPE_LABELS, type CertificateTemplate } from "@/modules/certificates/types/certificate.types";
import { TEMPLATE_LIBRARY } from "@/modules/certificates/utils/templatesLibrary";
import { TemplateThumbnail } from "@/modules/certificates/components/TemplateThumbnail";

import { useRolePath } from "@/hooks/useRolePath";

type TemplateFilterTab = "all" | "certificates" | "fees" | "results" | "admission";

export function TemplateHubPage() {
  const navigate = useNavigate();
  const { rolePath, roleNavigate } = useRolePath();
  const [tab, setTab] = useState<TemplateFilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const { state: templateState, deleteTemplate, duplicateTemplate } = useCertificateTemplates();

  const templates = templateState.data || [];
  const isLoading = templateState.status === "loading" || templateState.status === "idle";

  // Filter list by tab and search
  const filteredTemplates = useMemo(() => {
    let list = templates;

    if (tab === "certificates") {
      list = list.filter((t) => (t.type as string) !== "fee_challan" && (t.type as string) !== "result_card" && (t.type as string) !== "admission_form");
    } else if (tab === "fees") {
      list = list.filter((t) => (t.type as string) === "fee_challan");
    } else if (tab === "results") {
      list = list.filter((t) => (t.type as string) === "result_card");
    } else if (tab === "admission") {
      list = list.filter((t) => (t.type as string) === "admission_form");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(q) || t.type.toLowerCase().includes(q)
      );
    }
    return list;
  }, [templates, tab, searchQuery]);

  const stats = useMemo(() => ({
    total: templates.length,
    certificates: templates.filter((t) => (t.type as string) !== "fee_challan" && (t.type as string) !== "result_card" && (t.type as string) !== "admission_form").length,
    fees: templates.filter((t) => (t.type as string) === "fee_challan").length,
    results: templates.filter((t) => (t.type as string) === "result_card").length,
    admission: templates.filter((t) => (t.type as string) === "admission_form").length,
  }), [templates]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    await deleteTemplate(pendingDelete);
    setPendingDelete(null);
  };

  return (
    <div className="space-y-6 pb-12 px-4 max-w-7xl mx-auto py-6">
      
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Template Designer</p>
          <p className="mt-0.5 text-sm font-bold text-slate-900 truncate">Manage Custom Layouts</p>
        </div>
        <button
          type="button"
          onClick={() => roleNavigate("/admin/templates/create")}
          className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/10 hover:bg-blue-700 transition-colors"
        >
          <AppIcon name="Plus" className="w-3.5 h-3.5" />
          Create Template
        </button>
      </div>

      {/* Stats row */}
      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCardCompact label="Total Templates" value={stats.total} icon="description" accent="blue" />
          <StatCardCompact label="Certificates & IDs" value={stats.certificates} icon="award" accent="emerald" />
          <StatCardCompact label="Fee Challans" value={stats.fees} icon="receipt_long" accent="purple" />
          <StatCardCompact label="Result Cards" value={stats.results} icon="assignment" accent="amber" />
          <StatCardCompact label="Admission Forms" value={stats.admission} icon="inventory" accent="rose" />
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0 shadow-md shadow-blue-600/10">
            <AppIcon name="Sparkles" className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Template Studio
            </p>
            <p className="text-xs font-bold text-slate-800">
              Manage Custom Layouts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search bar */}
          <div className="relative">
            <AppIcon name="Search" className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search layouts..."
              className="h-8 w-[180px] rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-[11px] outline-none transition-all focus:border-blue-600 focus:bg-white placeholder:text-slate-400 text-slate-700 font-medium"
            />
          </div>

          {/* Type filters */}
          <div className="inline-flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            {(
              [
                { id: "all", label: "All" },
                { id: "certificates", label: "Certificates" },
                { id: "fees", label: "Challans" },
                { id: "results", label: "Results" },
                { id: "admission", label: "Admission" }
              ] as { id: TemplateFilterTab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`h-7 px-3 rounded-md text-[10px] font-bold transition-all ${
                  tab === t.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {/* Premium Pre-built Templates */}
      <div className="mt-8 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <AppIcon name="Crown" className="text-amber-500" size={20} />
          <h2 className="text-lg font-bold text-slate-900">Premium Pre-built Templates</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {TEMPLATE_LIBRARY.filter(t => 
             (tab === "all") || 
             (tab === "certificates" && t.category === "Certificates") ||
             (tab === "fees" && t.category === "Fee Challans") ||
             (tab === "results" && t.category === "Result Cards") ||
             (tab === "admission" && t.category === "Admission Forms")
          ).map(template => (
            <div key={template.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-400 transition-all group flex flex-col">
              <div className="aspect-[1.414] bg-slate-50 border-b border-slate-200 relative overflow-hidden flex items-center justify-center p-3">
                <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors z-10" />
                
                {/* Live scaled render of the template */}
                <TemplateThumbnail fabricData={template.fabricData} category={template.category} />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                  <button 
                    onClick={() => roleNavigate(`/admin/templates/create?preset=${template.id}`)}
                    className="px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
                  >
                    Use Template
                  </button>
                </div>
              </div>
              <div className="p-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">{template.category}</span>
                <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{template.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 mt-8">
        <AppIcon name="FolderEdit" className="text-blue-500" size={20} />
        <h2 className="text-lg font-bold text-slate-900">Your Custom Templates</h2>
      </div>

      {/* Templates List */}
      {!isLoading && (
        <>
          {filteredTemplates.length === 0 ? (
            <DataState
              variant="empty"
              title="No templates found"
              message="Create a new visual layout using the Canva-style Template Designer."
            />
          ) : (
            <EntityGrid>
              {filteredTemplates.map((template) => {
                const isFee = (template.type as string) === "fee_challan";
                const isResult = (template.type as string) === "result_card";
                const isAdmit = (template.type as string) === "admission_form";
                
                let linkPath = rolePath(`/admin/templates/edit/${template._id}`);
                let label = CERTIFICATE_TYPE_LABELS[template.type as keyof typeof CERTIFICATE_TYPE_LABELS] || template.type.replace("_", " ");
                let accentColor: "blue" | "purple" | "emerald" | "amber" | "rose" = "blue";
                
                if (isFee) {
                  accentColor = "purple";
                  label = "Fee Challan Bill";
                } else if (isResult) {
                  accentColor = "amber";
                  label = "Academic Result Card";
                } else if (isAdmit) {
                  accentColor = "rose";
                  label = "Admission Intake Form";
                } else if ((template.type as string) === "id_card") {
                  accentColor = "emerald";
                  label = "Student ID Card";
                }

                return (
                  <EntityCard
                    key={template._id}
                    icon={isFee ? "receipt_long" : isResult ? "assignment" : "award"}
                    accent={accentColor}
                    title={template.name}
                    subtitle={label}
                    status={{
                      label: template.orientation,
                      accent: template.orientation === "landscape" ? "blue" : "purple",
                    }}
                    hoverActions={[
                      {
                        label: "Duplicate",
                        icon: "content_copy",
                        onClick: () => duplicateTemplate(template._id),
                        accent: "blue",
                      },
                      {
                        label: "Delete",
                        icon: "delete",
                        onClick: () => setPendingDelete(template._id),
                        accent: "rose",
                      },
                    ]}
                    metrics={[
                      { label: "Format", value: template.orientation },
                      { label: "Status", value: template.status },
                    ]}
                    actions={[
                      {
                        label: "Edit Layout",
                        icon: "edit",
                        to: linkPath,
                        accent: "blue",
                        primary: true,
                      },
                      ...(isFee 
                        ? [{
                            label: "Go to Fees",
                            icon: "payments",
                            to: rolePath("/admin/fee"),
                            accent: "purple" as const,
                          }]
                        : isResult 
                        ? [{
                            label: "Go to Results",
                            icon: "assessment",
                            to: rolePath("/admin/results"),
                            accent: "amber" as const,
                          }]
                        : [{
                            label: "Generate Documents",
                            icon: "print",
                            to: rolePath(`/admin/certificates/generate/${template._id}`),
                            accent: "emerald" as const,
                          }]
                      )
                    ]}
                  />
                );
              })}
            </EntityGrid>
          )}
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={pendingDelete !== null}
        title="Delete this template?"
        message="Are you sure you want to permanently remove this canvas design layout? All dynamic values will be deleted."
        confirmLabel="Delete"
        confirmVariant="danger"
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
export default TemplateHubPage;
