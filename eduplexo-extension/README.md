# Eduplexo Extension

Eduplexo Extension adds controlled dummy-data generation for schools, campuses,
classes, sections, teachers, students, subjects, guardians, and import history.

## What Was Added

- Backend API module: `backend-go/internal/domain/eduplexoextension`
- Database migration: `backend-go/migrations/000031_eduplexo_extension.*.sql`
- Frontend module: `school-react-app/src/modules/eduplexo-extension`
- Admin route: `/admin/eduplexo-extension`
- Owner route: `/owner/eduplexo-extension`
- Teacher route: `/teacher/eduplexo-extension`
- API documentation folder: `eduplexo-extension/apis`

## API Setup

The API base path is:

```text
/api/eduplexo-extension
```

No new external API key is required. The extension uses the existing Eduplexo
auth, role, tenant, campus, and database setup.

Full API docs are in:

```text
eduplexo-extension/apis/README.md
eduplexo-extension/apis/openapi.yaml
eduplexo-extension/apis/example-preview.json
```

## Required Database Migration

Run migration `000031_eduplexo_extension.up.sql` before using history in a
PostgreSQL-backed environment. It creates `dummy_data_batches`, which stores
batch history, role, school/campus/owner details, counts, status, and metadata.
