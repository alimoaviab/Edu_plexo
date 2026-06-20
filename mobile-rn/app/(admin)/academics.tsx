import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

const ITEMS: ModuleListItem[] = [
  { key: 'classes', label: 'Classes', description: 'Sections, batches, subject mapping', icon: 'graduation', accent: 'primary', href: '/(admin)/module/classes' },
  { key: 'subjects', label: 'Subjects', description: 'Subjects, marks and owners', icon: 'book', accent: 'primary', href: '/(admin)/module/subjects' },
  { key: 'academic-years', label: 'Academic Years', description: 'Sessions and active year', icon: 'calendar', accent: 'success', href: '/(admin)/module/academic-years' },
  { key: 'timetable', label: 'Timetable', description: 'Weekly schedules per class', icon: 'calendar', accent: 'success', href: '/(admin)/module/timetable' },
  { key: 'attendance', label: 'Attendance', description: 'Daily attendance & analytics', icon: 'check-circle', accent: 'success', href: '/(admin)/module/attendance' },
  { key: 'exams', label: 'Exams', description: 'Term exams & schedules', icon: 'clipboard', accent: 'warning', href: '/(admin)/module/exams' },
  { key: 'tests', label: 'Tests', description: 'Class tests & quizzes', icon: 'clipboard', accent: 'warning', href: '/(admin)/module/tests' },
  { key: 'results', label: 'Results', description: 'Marks, marksheets, transcripts', icon: 'star', accent: 'success', href: '/(admin)/module/results' },
  { key: 'live-classes', label: 'Live Classes', description: 'Online sessions & recordings', icon: 'video', accent: 'primary', href: '/(admin)/module/live-classes' },
  { key: 'homework', label: 'Homework', description: 'Assignments & submissions', icon: 'book', accent: 'primary', href: '/(admin)/module/homework' },
  { key: 'question-bank', label: 'Question Bank', description: 'Questions and moderation', icon: 'book', accent: 'primary', href: '/(admin)/module/question-bank' },
  { key: 'question-papers', label: 'Question Papers', description: 'Saved and generated papers', icon: 'clipboard', accent: 'warning', href: '/(admin)/module/question-papers' },
  { key: 'chapters', label: 'Chapters', description: 'Syllabus chapter catalog', icon: 'book', accent: 'primary', href: '/(admin)/module/chapters' },
  { key: 'certificate-templates', label: 'Certificate Templates', description: 'Template CRUD', icon: 'star', accent: 'success', href: '/(admin)/module/certificate-templates' },
  { key: 'certificates', label: 'Certificates', description: 'Generated certificates', icon: 'star', accent: 'success', href: '/(admin)/module/certificates' },
];

export default function Academics() {
  return (
    <ModuleListScreen
      greeting="Academic Care"
      title="Academics"
      subtitle="Curriculum, schedules and evaluations"
      items={ITEMS}
    />
  );
}
