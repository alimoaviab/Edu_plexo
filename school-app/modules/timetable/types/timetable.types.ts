export interface TimetableRecordRow {
  _id: string;
  class_id: string;
  class_name: string;
  teacher_id: string;
  teacher_name: string;
  subject_id: string;
  subject_name: string;
  day_of_week: number;
  period_number: number;
  start_time: string;
  end_time: string;
  room?: string;
}

export interface TimetableFormInput {
  class_id: string;
  teacher_id: string;
  subject_id: string;
  day_of_week: number;
  period_number: number;
  start_time: string;
  end_time: string;
  room?: string;
}
