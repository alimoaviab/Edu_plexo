# Eduplexo Extension APIs

Base path: `/api/eduplexo-extension`

All endpoints require the existing Eduplexo JWT/session auth. No new external
API key is needed for the dummy-data generator.

## Endpoints

| Purpose | Method | Path |
| --- | --- | --- |
| Auth/current user API | `GET` | `/auth/current` |
| Extension bootstrap context | `GET` | `/context` |
| Schools list API | `GET` | `/schools` |
| Campuses by school API | `GET` | `/schools/{schoolID}/campuses` |
| Owner/admin/teacher hierarchy API | `GET` | `/hierarchy?school_id=&campus_id=&teacher_id=` |
| Dummy data generate preview API | `POST` | `/preview` |
| Dummy data insert API | `POST` | `/insert` |
| Dummy data history/list API | `GET` | `/history` |
| Batch detail API | `GET` | `/history/{id}` |
| Optional batch revert/delete API | `POST` | `/history/{id}/revert` |
| History CSV export | `GET` | `/history/export.csv` |

## Insert Flow

1. Call `GET /context` to populate school/campus defaults.
2. Call `POST /preview` with the generator payload.
3. Show preview counts and warnings to the user.
4. Call `POST /insert` with the same payload plus `"confirm": true`.
5. Read saved batches from `GET /history`.

## Example Preview Payload

```json
{
  "batch_name": "Lahore demo batch",
  "school_id": "school_default",
  "school_name": "Eduplexo Academy",
  "campus_id": "camp_main",
  "campus_name": "Main Campus",
  "owner_name": "Ali Owner",
  "city": "Lahore",
  "country": "Pakistan",
  "academic_year": "2026-2027",
  "admin_count": 1,
  "teacher_count": 6,
  "student_count": 60,
  "class_count": 4,
  "sections_per_class": 2,
  "subjects_per_class": 5
}
```

## Role Rules

- Owner and super admin can work across schools.
- Admin is scoped to the active school/campus.
- Teacher can only generate students for assigned classes.
- Every insert creates a `dummy_data_batches` history row with hierarchy metadata.
