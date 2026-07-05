<<<<<<< HEAD
import SchedulePage from "@/pages/role/shared/schedule";

export function AdminSchedulePage() {
  return <SchedulePage />;
}
export default SchedulePage;

=======
import { SchoolShell } from "@/layouts/SchoolShell";

export function AdminSchedulePage() {
  return (
    <SchoolShell eyebrow="Settings" title="Event Schedule">
      <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        Schedule module is currently under development.
      </div>
    </SchoolShell>
  );
}
>>>>>>> 9415cd3 (create app)
