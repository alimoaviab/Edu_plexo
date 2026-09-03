package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"fmt"
	"math/big"
	"strings"
	"unicode"
)

// GenerateCryptoOTP generates a cryptographically secure numeric OTP of the specified length.
// Leading zeroes are preserved (e.g. "004821").
func GenerateCryptoOTP(length int) (string, error) {
	if length <= 0 {
		length = 6
	}

	// Maximum limit is 10^length (e.g. 1,000,000 for 6 digits: 0 to 999,999)
	limit := new(big.Int).Exp(big.NewInt(10), big.NewInt(int64(length)), nil)
	n, err := rand.Int(rand.Reader, limit)
	if err != nil {
		return "", fmt.Errorf("crypto/rand failed: %w", err)
	}

	format := fmt.Sprintf("%%0%dd", length)
	return fmt.Sprintf(format, n.Int64()), nil
}

// HashOTP computes a SHA-256 hexadecimal hash of the submitted OTP.
// The raw OTP is never stored in the database.
func HashOTP(otp string) string {
	clean := strings.TrimSpace(otp)
	sum := sha256.Sum256([]byte(clean))
	return hex.EncodeToString(sum[:])
}

// VerifyOTPHash securely compares a submitted raw OTP against a stored SHA-256 hash.
// Uses constant-time comparison to protect against timing side-channel attacks.
func VerifyOTPHash(submittedOTP, storedHash string) bool {
	if submittedOTP == "" || storedHash == "" {
		return false
	}
	computedHash := HashOTP(submittedOTP)
	storedClean := strings.ToLower(strings.TrimSpace(storedHash))
	return subtle.ConstantTimeCompare([]byte(computedHash), []byte(storedClean)) == 1
}

// ValidateOTPFormat checks if the string contains exactly length digits.
func ValidateOTPFormat(otp string, expectedLength int) bool {
	clean := strings.TrimSpace(otp)
	if len(clean) != expectedLength {
		return false
	}
	for _, r := range clean {
		if !unicode.IsDigit(r) {
			return false
		}
	}
	return true
}
