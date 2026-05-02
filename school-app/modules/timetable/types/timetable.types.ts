export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface TimetableRecord {
  _id: string;
  class_id: string;
  class_name: string;
  section?: string;
  subject_id: string;
  subject_name: string;
  teacher_id: string;
  teacher_name: string;
  day: DayOfWeek;
  start_time: string; // HH:mm
  end_time: string;   // HH:mm
  room?: string;
  academy_care_id: string;
  created_at: string;
  updated_at: string;
}

export interface TimetableFormInput {
  class_id: string;
  section?: string;
  subject_id: string;
  teacher_id: string;
  day: DayOfWeek;
  start_time: string;
  end_time: string;
  room?: string;
}
