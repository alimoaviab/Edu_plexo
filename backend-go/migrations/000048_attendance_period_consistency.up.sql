-- 000048: attendance period consistency.
--
-- The single-record CRUD endpoint (POST /api/attendance) historically stored
-- period=0 when the client omitted the field, while every reader
-- (attendance sheet JOIN, dashboard aggregation, /attendance/mark upsert)
-- operates on period=1 for the daily sheet. Rows stuck at period=0 were
-- invisible to the sheet and double-counted nowhere, but left the CRUD
-- duplicate guard diverging from the mark endpoint's uniqueness.
--
-- 1) Fold legacy period=0 rows into period=1. Any real period-1 conflict is
--    resolved by keeping the most recently updated row.
-- 2) Guard against new zero/negative periods at the database level.

UPDATE attendance a
SET    period = 1
WHERE  a.period < 1;

ALTER TABLE attendance
    DROP CONSTRAINT IF EXISTS attendance_period_chk;

ALTER TABLE attendance
    ADD CONSTRAINT attendance_period_chk CHECK (period >= 1);
