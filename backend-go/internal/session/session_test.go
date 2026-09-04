package session

import "testing"

func TestMemoryRevoker_RevokeAndCheck(t *testing.T) {
	r := New(nil)
	if r.Revoked("sess_1") {
		t.Fatal("fresh session must not be revoked")
	}
	r.Revoke("sess_1")
	if !r.Revoked("sess_1") {
		t.Fatal("revoked session must be reported revoked")
	}
	if r.Revoked("sess_2") {
		t.Fatal("unrelated session must stay valid")
	}
}

func TestMemoryRevoker_EmptySessionNeverRevoked(t *testing.T) {
	r := New(nil)
	r.Revoke("")
	if r.Revoked("") {
		t.Fatal("empty session id must never be treated as revoked")
	}
}
