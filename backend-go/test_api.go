package main

import (
	"bytes"
	"fmt"
	"net/http"
	"io/ioutil"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func main() {
	secret := []byte("testsecret123")
	claims := jwt.MapClaims{
		"user_id":   "usr_1",
		"school_id": "sch_1",
		"role":      "school_admin",
		"exp":       time.Now().Add(time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, _ := token.SignedString(secret)

	// Test Student Create
	studentPayload := []byte(`{"first_name":"Test","last_name":"Student","class_id":"cls_1","admission_no":"adm-test-1","guardian":{"name":"Parent","phone":"1234","email":"parent@test.com"},"email":"parent@test.com","password":"password123"}`)
	req, _ := http.NewRequest("POST", "http://localhost:8080/api/students", bytes.NewBuffer(studentPayload))
	req.Header.Set("Authorization", "Bearer "+tokenStr)
	req.Header.Set("Content-Type", "application/json")
	
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("Student Response:", resp.StatusCode, string(body))

	// Test Teacher Create
	teacherPayload := []byte(`{"first_name":"Test","last_name":"Teacher","employee_no":"emp-test-1","email":"teacher@test.com","password":"password123","phone":"1234"}`)
	req2, _ := http.NewRequest("POST", "http://localhost:8080/api/teachers", bytes.NewBuffer(teacherPayload))
	req2.Header.Set("Authorization", "Bearer "+tokenStr)
	req2.Header.Set("Content-Type", "application/json")
	
	resp2, _ := client.Do(req2)
	body2, _ := ioutil.ReadAll(resp2.Body)
	fmt.Println("Teacher Response:", resp2.StatusCode, string(body2))
}
