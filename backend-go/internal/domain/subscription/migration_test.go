package subscription

import (
	"os"
	"strings"
	"testing"
)

func TestSuperAdminMigrationPreservesCoreBillingTables(t *testing.T) {
	up, err := os.ReadFile("../../../migrations/000021_super_admin.up.sql")
	if err != nil {
		t.Fatalf("read up migration: %v", err)
	}
	down, err := os.ReadFile("../../../migrations/000021_super_admin.down.sql")
	if err != nil {
		t.Fatalf("read down migration: %v", err)
	}

	upSQL := strings.ToUpper(string(up))
	downSQL := strings.ToUpper(string(down))
	for _, forbidden := range []string{
		"DROP TABLE IF EXISTS SUBSCRIPTIONS",
		"DROP TABLE IF EXISTS SUBSCRIPTION_PLANS",
	} {
		if strings.Contains(upSQL, forbidden) {
			t.Fatalf("up migration must not destructively drop billing table with %q", forbidden)
		}
		if strings.Contains(downSQL, forbidden) {
			t.Fatalf("down migration must not drop pre-existing billing table with %q", forbidden)
		}
	}

	for _, required := range []string{
		"ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_id TEXT",
		"ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMP",
		"ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS slug TEXT",
		"ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS billing_cycle TEXT",
	} {
		if !strings.Contains(string(up), required) {
			t.Fatalf("up migration missing additive compatibility step %q", required)
		}
	}
}
