<<<<<<< HEAD
import { MessagesPage } from "@/pages/role/shared/messages";

export function AdminMessagesPage() {
  return <MessagesPage />;
}
export default MessagesPage;

=======
import { SchoolShell } from "@/layouts/SchoolShell";

export function AdminMessagesPage() {
  return (
    <SchoolShell eyebrow="Communication" title="Conversations">
      <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        Conversations module is currently under development.
      </div>
    </SchoolShell>
  );
}
>>>>>>> 9415cd3 (create app)
