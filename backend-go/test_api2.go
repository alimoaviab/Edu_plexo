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
		"school_id": "sch_1", // Make sure this school exists!
		"role":      "school_admin",
		"exp":       time.Now().Add(time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, _ := token.SignedString(secret)

	// Test Teacher Create
	teacherPayload := []byte(`{"first_name":"Test","last_name":"Teacher2","email":"teacher2@test.com","password":"password123","phone":"1234"}`)
	req2, _ := http.NewRequest("POST", "http://localhost:8080/api/teachers", bytes.NewBuffer(teacherPayload))
	req2.Header.Set("Authorization", "Bearer "+tokenStr)
	req2.Header.Set("Content-Type", "application/json")
	
	client := &http.Client{}
	resp2, _ := client.Do(req2)
	body2, _ := ioutil.ReadAll(resp2.Body)
	fmt.Println("Teacher Response:", resp2.StatusCode, string(body2))
}
