package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, "postgres://school_user:school_password@localhost:5432/school_db")
	if err != nil {
		fmt.Println("Connect error:", err)
		return
	}
	defer pool.Close()

	rows, err := pool.Query(ctx, "SELECT id, name, student_limit, price, COALESCE(currency,'PKR'), features, is_custom, display_order FROM subscription_plans WHERE is_active = true ORDER BY display_order ASC, created_at ASC")
	if err != nil {
		fmt.Println("Query error:", err)
		return
	}
	defer rows.Close()

	count := 0
	for rows.Next() {
		var id, name, currency string
		var limit, price, displayOrder int
		var featuresJSON []byte
		var isCustom bool
		if err := rows.Scan(&id, &name, &limit, &price, &currency, &featuresJSON, &isCustom, &displayOrder); err != nil {
			fmt.Println("Scan error:", err)
			continue
		}
		count++
		decoded := DecodeFeaturesJSON(featuresJSON)
		fmt.Printf("ID: %s, Decoded Count: %d, Decoded: %v\n", id, len(decoded), decoded)
	}
	fmt.Println("Total:", count)
}

func DecodeFeaturesJSON(featuresJSON []byte) []string {
	if len(featuresJSON) == 0 {
		return []string{}
	}
	var featuresArr []string
	if err := json.Unmarshal(featuresJSON, &featuresArr); err == nil {
		if featuresArr == nil {
			return []string{}
		}
		return featuresArr
	} else {
		fmt.Println("Unmarshal to []string error:", err)
	}

	// Try unmarshalling as map[string]bool
	var featuresMap map[string]bool
	if err := json.Unmarshal(featuresJSON, &featuresMap); err == nil {
		keys := []string{"attendance", "exams", "homework", "live_classes", "ai_features", "parent_portal", "teacher_portal", "notifications", "analytics", "reports"}
		niceNames := map[string]string{
			"attendance":     "Attendance Tracking",
			"exams":          "Exam Management",
			"homework":       "Homework & Assignments",
			"live_classes":   "Live Classes Integration",
			"ai_features":    "AI Plexa Chatbot",
			"parent_portal":  "Parent Portal App",
			"teacher_portal": "Teacher Portal App",
			"notifications":  "SMS Notifications",
			"analytics":      "Analytics Dashboard",
			"reports":        "Detailed Marksheets & Reports",
		}
		result := make([]string, 0)
		for _, k := range keys {
			if val, ok := featuresMap[k]; ok && val {
				result = append(result, niceNames[k])
			}
		}
		return result
	} else {
		fmt.Println("Unmarshal to map[string]bool error:", err)
	}

	return []string{}
}

