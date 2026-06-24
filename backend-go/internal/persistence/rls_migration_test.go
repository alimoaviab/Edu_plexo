package persistence

import (
	"os"
	"strings"
	"testing"
)

func TestLaterModuleRLSMigrationCoversTenantTables(t *testing.T) {
	migration, err := os.ReadFile("../../migrations/000024_rls_later_modules.up.sql")
	if err != nil {
		t.Fatalf("read RLS migration: %v", err)
	}
	sql := string(migration)

	for _, table := range []string{
		"chapters",
		"questions",
		"question_papers",
		"star_collections",
		"paper_drafts",
		"student_scholarships",
		"student_fee_discounts",
		"student_wallets",
		"wallet_transactions",
		"conversations",
		"conversation_participants",
		"chat_messages",
		"broadcasts",
		"schedules",
		"schedule_reminders",
		"import_logs",
		"topics",
	} {
		if !strings.Contains(sql, "ALTER TABLE "+table+" ENABLE ROW LEVEL SECURITY") {
			t.Fatalf("missing RLS enable for %s", table)
		}
		if !strings.Contains(sql, "CREATE POLICY tenant_isolation ON "+table) {
			t.Fatalf("missing tenant isolation policy for %s", table)
		}
	}
}
