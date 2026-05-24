import { useParams } from "react-router-dom";
import { StudentHomeworkDetailPage } from "@/modules/homework/pages/StudentHomeworkDetailPage";

export function StudentHomeworkViewPage() {
  const { id } = useParams<{ id: string }>();
  return <StudentHomeworkDetailPage homeworkId={id ?? ""} />;
}
