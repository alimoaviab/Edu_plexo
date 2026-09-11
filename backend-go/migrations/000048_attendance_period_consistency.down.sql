-- Revert 000048: drop the period guard. Historical period=1 values that were
-- folded up from 0 are not restored (the original zero values carried no
-- meaning for any reader and cannot be distinguished from real period-1 rows).

ALTER TABLE attendance
    DROP CONSTRAINT IF EXISTS attendance_period_chk;
