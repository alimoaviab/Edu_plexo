import { TimetablePage } from "../../../modules/timetable/pages/TimetablePage";
import { SchoolShell } from "../../../layouts/SchoolShell";

export default function TimetableRoute() {
  return (
    <SchoolShell eyebrow="Academic" title="Timetable">
      <TimetablePage />
    </SchoolShell>
  );
}
