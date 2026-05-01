export interface EventRecordRow {
  _id: string;
  title: string;
  description?: string;
  event_type: "holiday" | "exam" | "meeting" | "activity" | "sports" | "other";
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  visibility: "public" | "teachers_only" | "students_only" | "specific_classes";
  target_class_ids?: string[];
  organizer?: string;
  status: "draft" | "published" | "cancelled";
  created_by?: string;
  created_at?: string;
}

export interface EventFormInput {
  title: string;
  description?: string;
  event_type: EventRecordRow["event_type"];
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  visibility: EventRecordRow["visibility"];
  target_class_ids?: string[];
  organizer?: string;
  status: EventRecordRow["status"];
}
