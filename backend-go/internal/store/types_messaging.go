package store

import "time"

// Conversation represents a chat conversation between two users.
type Conversation struct {
	ID           string                    `json:"_id"`
	SchoolID     string                    `json:"school_id"`
	Type         string                    `json:"type"` // "private", "group"
	Participants []ConversationParticipant `json:"participants"`
	CreatedAt    time.Time                 `json:"created_at"`
	UpdatedAt    time.Time                 `json:"updated_at"`
}

// ConversationParticipant represents a user in a conversation.
type ConversationParticipant struct {
	UserID   string    `json:"user_id"`
	Role     string    `json:"role"`
	JoinedAt time.Time `json:"joined_at"`
}

// ChatMessage represents a single message in a conversation.
type ChatMessage struct {
	ID             string    `json:"_id"`
	ConversationID string    `json:"conversation_id"`
	SenderID       string    `json:"sender_id"`
	Text           string    `json:"text"`
	AttachmentURL  string    `json:"attachment_url,omitempty"`
	AttachmentType string    `json:"attachment_type,omitempty"` // "image", "pdf", "document"
	ReplyToID      string    `json:"reply_to_id,omitempty"`
	DeliveredAt    time.Time `json:"delivered_at"`
	SeenAt         time.Time `json:"seen_at,omitempty"`
	ExpiresAt      time.Time `json:"expires_at"`
	CreatedAt      time.Time `json:"created_at"`
}

// Broadcast represents an admin broadcast message.
type Broadcast struct {
	ID          string    `json:"_id"`
	SchoolID    string    `json:"school_id"`
	SenderID    string    `json:"sender_id"`
	TargetGroup string    `json:"target_group"` // "all", "teachers", "parents", "students", "class:{id}"
	Message     string    `json:"message"`
	Type        string    `json:"type"` // "text", "emergency", "notice"
	CreatedAt   time.Time `json:"created_at"`
}
