# Quick Start: EduPlexo Messaging System

## 🚀 Getting Started

### 1. Start the System
```bash
cd /Users/ali/Desktop/EDUEXPLO/Eduplexo
docker compose up -d --build
```

### 2. Access the Portals
- **School App**: http://localhost:3000
- **Super Admin**: http://localhost:3001
- **Landing Page**: http://localhost:3002
- **Backend API**: http://localhost:8080

### 3. Login Credentials
```
Email: admin@school.test
Password: admin123
Role: Admin
```

## 📱 Using the Messaging System

### For Admin Users
1. Login to http://localhost:3000
2. Click **Messages** in the sidebar
3. Click **New Chat** button
4. Select a teacher or student
5. Start typing and send messages

### For Teachers
1. Login with teacher credentials
2. Navigate to **Messages**
3. View conversations with students and admins
4. Reply to messages
5. See typing indicators and delivery status

### For Students
1. Login with student credentials
2. Go to **Messages**
3. Create new chat with teacher or admin
4. Send messages
5. Messages auto-delete after 7 days

## 🔍 Testing the API

### Get Conversations
```bash
curl -X GET http://localhost:8080/api/messages/conversations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Create Conversation
```bash
curl -X POST http://localhost:8080/api/messages/conversations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_id": "teacher-user-id"
  }'
```

### Send Message
```bash
curl -X POST http://localhost:8080/api/messages/conversations/CONV_ID/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?"
  }'
```

### Mark Message as Seen
```bash
curl -X POST http://localhost:8080/api/messages/conversations/CONV_ID/seen \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## 🎯 Key Features

✅ **Real-time Messaging** - WebSocket-powered instant delivery
✅ **Typing Indicators** - See when someone is typing
✅ **Delivery Status** - ✓ for delivered, ✓✓ for seen
✅ **Auto-delete** - Messages expire after 7 days
✅ **Anti-spam** - Rate limiting per role
✅ **Privacy** - Hidden contact info, internal IDs only
✅ **Admin Broadcasts** - Send to specific groups
✅ **WhatsApp UI** - Modern, intuitive interface

## 🔒 Security

- JWT authentication on all endpoints
- Role-based access control
- Rate limiting (10/min students, 30/min teachers, 60/min admins)
- No student-to-student chats
- Encrypted connections (HTTPS in production)
- SQL injection prevention
- XSS protection

## 📊 Database

All messaging data is stored in PostgreSQL:
- Conversations table
- Messages table
- Conversation participants table
- Broadcasts table

Auto-cleanup job runs daily to delete expired messages.

## 🐛 Troubleshooting

### Messages not appearing?
1. Check WebSocket connection in browser DevTools
2. Verify JWT token is valid
3. Check backend logs: `docker logs school_backend`
4. Ensure both users are in the same school

### Rate limit exceeded?
- Wait 1 minute before sending more messages
- Admins have higher limits (60/min)

### Messages not auto-deleting?
- Check cleanup job in backend logs
- Verify `MESSAGE_EXPIRY_DAYS=7` in environment

### Can't create conversation?
- Verify recipient is a valid user
- Check role permissions (student can only chat with teacher/admin)
- Ensure both users are in same school

## 📞 Support

For detailed documentation, see:
- `MESSAGING_SYSTEM.md` - Complete system documentation
- `README.md` - Project overview
- Backend logs: `docker logs school_backend`
- Frontend console: Browser DevTools → Console

## 🎉 You're All Set!

The messaging system is fully integrated and ready to use. Start chatting!
