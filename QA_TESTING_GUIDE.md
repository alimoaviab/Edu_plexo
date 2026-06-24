# Eduplexo QA Testing Guide

## Overview
This document outlines the critical testing scope and test cases for the Eduplexo School Management ERP SaaS platform. Based on the latest implementation phases, QA should heavily focus on Authentication/RBAC, Data Consistency (Payments & Subscriptions), Frontend Security (XSS protection), and Performance.

---

## 1. Authentication & RBAC (Role-Based Access Control)
### Super Admin Access
- [ ] **Login & Cookies:** Verify that a Super Admin can successfully log in and that secure session cookies (`HttpOnly`) are properly generated.
- [ ] **Logout:** Verify that the Super Admin can log out, and session cookies are cleared completely.
- [ ] **Strict Isolation (Super Admin):** Ensure that a School Admin *cannot* access the Super Admin UI or API endpoints. Attempting to do so should result in an unauthorized error.
- [ ] **Strict Isolation (School Admin):** Ensure that a Super Admin *cannot* log into the School Admin interface with Super Admin credentials.
- [ ] **Password Reset:** Verify the password reset functionality. Ensure it rejects weak passwords and hashes the new password securely.
- [ ] **Data Privacy:** Verify that network API responses (e.g., user profiles, admin lists) do not expose sensitive password fields or hashes.

### School App Access
- [ ] **Login:** Verify School Admin and staff login flows using JWT (localStorage).
- [ ] **Tenant Isolation (RLS):** Verify cross-tenant security. Ensure that users from "School A" absolutely cannot access, view, or modify data from "School B" (e.g., by manipulating tenant IDs or URLs).

---

## 2. Subscription & Tenant Management
- [ ] **Tenant Creation:** Verify that a Super Admin can create a new School/Tenant successfully.
- [ ] **Plan Assignment:** As a Super Admin, assign a new subscription plan to a school. 
- [ ] **Transaction Consistency:** Verify that the old plan is gracefully transitioned, the new plan is active, and the subscription history log is updated correctly.
- [ ] **Concurrency Test:** Try to assign plans or submit the form multiple times rapidly. The system should process it safely as a single transaction without creating duplicate active subscriptions.

---

## 3. Student & Parent Management
- [ ] **Creation:** Test student creation with a parent profile. Provide valid data and verify proper persistence in the database.
- [ ] **Failure Rollback:** Test failure cases in student creation (e.g., provide invalid data that forces a database error). Ensure that the system rolls back smoothly and does not keep orphaned or half-created data in the application view or memory.
- [ ] **Updates:** Test updating and deleting functionality for student and parent profiles.

---

## 4. Fee Payments & Receipt Generation
- [ ] **Process Payment:** Process a fee payment for a student and verify that the correct receipt is generated.
- [ ] **Receipt Collision (Concurrency):** Open two tabs and attempt to process fee payments for the *same school* at the exact same time. Ensure that receipt numbers do not collide and remain unique and sequential.
- [ ] **Verification:** Verify that the generated fee receipts accurately reflect the payment details and amount.

---

## 5. Security & XSS (Cross-Site Scripting) Sanitization
*The application uses DOMPurify for HTML sanitization. Test the following areas by attempting to inject basic HTML/JS tags (e.g., `<script>alert('xss')</script>`, `<img src="x" onerror="alert(1)">`, `<b onmouseover="alert(1)">Hover me</b>`):*
- [ ] **Question Bank:** Attempt injection in question text, options, or answers.
- [ ] **Question Papers:** Attempt injection in paper descriptions, headers, or instructions.
- [ ] **Certificates:** Attempt injection in certificate layout text or names. Ensure CSS colors are restricted to valid, safe formats.
- [ ] **Global Question Bank:** Attempt injection in the global question text.
- [ ] **Moderation Panels:** Verify that any potentially malicious content submitted by a user is safely sanitized when viewed by a moderator.
- *Expected Result:* The injected scripts should never execute, and the HTML should either be safely sanitized or rendered as plain text.

---

## 6. Performance & UI/UX
- [ ] **Lazy Loading:** Verify that Super Admin routes lazy-load correctly (clicking different tabs shouldn't require massive initial JS loads, but fetch small chunks on demand).
- [ ] **App Responsiveness:** Navigate through the School App and verify that loading states (spinners/skeletons) are present and the UI responds smoothly without freezing.
- [ ] **Mobile/Responsive:** Test responsiveness on different screen sizes (Mobile, Tablet, Desktop) for critical areas like attendance, student lists, and dashboards.

---

## 7. Reporting & Exports
- [ ] Test the export functionality across different modules (Student list, Fee reports). Ensure the exported data (CSV/Excel/PDF) matches the table view exactly.

## 8. General Regression
- [ ] **Attendance:** Ensure the Attendance module functions correctly.
- [ ] **Messaging:** Ensure Messaging and Chatbot functionalities work as expected.
- [ ] **Schedules:** Ensure Class routines and Schedules load and save correctly.

---

**Note for QA:** 
Please report any anomalies or errors, particularly in areas dealing with payments, data persistence (like student creation errors), and cross-tenant data access. If you encounter UI errors, please include screen recordings and Browser Console logs in your bug reports.
