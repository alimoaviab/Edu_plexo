package auth

import (
	"testing"
)

func TestGenerateCryptoOTP_LengthAndDigits(t *testing.T) {
	for i := 0; i < 500; i++ {
		otp, err := GenerateCryptoOTP(6)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(otp) != 6 {
			t.Fatalf("expected length 6, got %d (otp: %q)", len(otp), otp)
		}
		if !ValidateOTPFormat(otp, 6) {
			t.Fatalf("expected valid 6-digit numeric OTP, got %q", otp)
		}
	}
}

func TestGenerateCryptoOTP_Uniqueness(t *testing.T) {
	seen := make(map[string]bool)
	collisions := 0
	sampleSize := 1000

	for i := 0; i < sampleSize; i++ {
		otp, err := GenerateCryptoOTP(6)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if seen[otp] {
			collisions++
		}
		seen[otp] = true
	}

	// For 6 digits (1,000,000 possibilities), sampling 1,000 should yield < 15 collisions on average
	if collisions > 20 {
		t.Fatalf("unusually high collision count: %d out of %d samples", collisions, sampleSize)
	}
}

func TestVerifyOTPHash_SuccessAndFailure(t *testing.T) {
	rawOTP := "004821"
	hash := HashOTP(rawOTP)

	if !VerifyOTPHash("004821", hash) {
		t.Fatal("expected exact OTP match to verify successfully")
	}

	if !VerifyOTPHash("  004821  ", hash) {
		t.Fatal("expected whitespace trimmed OTP to verify successfully")
	}

	if VerifyOTPHash("004822", hash) {
		t.Fatal("expected incorrect OTP to fail verification")
	}

	if VerifyOTPHash("", hash) {
		t.Fatal("expected empty OTP to fail verification")
	}

	if VerifyOTPHash(rawOTP, "") {
		t.Fatal("expected empty hash to fail verification")
	}
}

func TestValidateOTPFormat(t *testing.T) {
	cases := []struct {
		input  string
		length int
		valid  bool
	}{
		{"123456", 6, true},
		{"000000", 6, true},
		{"012345", 6, true},
		{"12345", 6, false},
		{"1234567", 6, false},
		{"12345a", 6, false},
		{"12 456", 6, false},
		{"-12345", 6, false},
		{"", 6, false},
	}

	for _, tc := range cases {
		got := ValidateOTPFormat(tc.input, tc.length)
		if got != tc.valid {
			t.Errorf("ValidateOTPFormat(%q, %d) = %v; want %v", tc.input, tc.length, got, tc.valid)
		}
	}
}
