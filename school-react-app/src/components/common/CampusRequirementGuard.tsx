import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AppIcon } from "shared/ui/AppIcon";
import { Button, Select, Skeleton } from "@/components/ui";
import { useCampusGuard, Campus } from "@/hooks/useCampusGuard";
import { useRolePath } from "@/hooks/useRolePath";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: ReactNode;
  entityName?: string; // e.g. "academic session", "class", "teacher"
  selectedCampusId?: string;
  onCampusChange?: (campusId: string) => void;
  showCampusSelect?: boolean;
}

export function CampusRequirementGuard({
  children,
  entityName = "record",
  selectedCampusId = "",
  onCampusChange,
  showCampusSelect = true,
}: Props) {
  const navigate = useNavigate();
  const { rolePath } = useRolePath();
  const { user } = useAuth();
  const { isLoading, hasSchools, campuses, activeCampusId, selectBranch } = useCampusGuard();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  // 1. School Check: ONLY the owner can and must create schools.
  // Admins, teachers, and school staff already belong to an owner's provisioned school.
  // They must NEVER be blocked by the owner onboarding screen.
  const isOwner = user?.role === "owner";
  if (isOwner && !hasSchools) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 shadow-sm text-center max-w-2xl mx-auto my-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 mb-4 shadow-sm">
          <AppIcon name="Building" size={28} />
        </div>
        <h3 className="text-lg font-bold text-rose-950 tracking-tight">
          School Required Before Creating {entityName.toUpperCase()}
        </h3>
        <p className="mt-2 text-xs font-medium text-rose-800/90 leading-relaxed max-w-md mx-auto">
          Jab tak owner koi school add na kare, tab tak koi bhi data (class, session, teacher, student) create nahi kiya ja sakta. Pehle apni school add karein.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/owner/schools")}
          >
            Create School
          </Button>
        </div>
      </div>
    );
  }

  const effectiveCampusId = selectedCampusId || activeCampusId;

  return (
    <div className="space-y-4">
      {showCampusSelect && campuses.length > 1 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AppIcon name="GitBranch" size={18} className="text-emerald-600" />
              <div>
                <label className="text-[11px] font-bold text-slate-800 block">
                  Select Campus / Branch *
                </label>
                <span className="text-[10px] font-medium text-slate-500">
                  Select which campus this {entityName} belongs to
                </span>
              </div>
            </div>
            <div className="w-full sm:w-64">
              <Select
                value={effectiveCampusId}
                onChange={(e) => {
                  const val = e.target.value;
                  selectBranch(val);
                  if (onCampusChange) onCampusChange(val);
                }}
                options={[
                  { label: "Select Campus...", value: "" },
                  ...campuses.map((c: Campus) => ({
                    label: c.name,
                    value: c._id || c.id || "",
                  })),
                ]}
              />
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
