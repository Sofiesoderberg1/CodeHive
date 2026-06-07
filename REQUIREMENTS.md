# Requirements

## Functional Requirements

### REQ-1 — Portfolio Display
The system shall display a portfolio on the developer's profile page.

Acceptance criteria:
- Each project must include a title
- Each project must include a description
- Each project must include an image or link
- Projects must be clearly listed

---

### REQ-2 — Live Chat
The system shall allow users to communicate with the developer in real time.

Acceptance criteria:
- Users can send messages
- Messages are displayed instantly
- Chat updates without page reload

---

### REQ-3 — Contact Form
The system shall provide a contact form for users.

Acceptance criteria:
- Form must include name, email and message
- User can submit the form
- Developer receives the message

---

### REQ-4 — Booking System
The system shall allow users to book a meeting.

Acceptance criteria:
- User can select date
- User can write a message
- Booking is submitted successfully

---

### REQ-5 — Navigation
The system shall provide navigation between pages.

Acceptance criteria:
- User can navigate to Home
- User can navigate to Portfolio
- User can navigate to Book
- User can navigate to Chat

---

### REQ-6 — User Authentication
The system shall allow users to register, log in and log out securely

Acceptance criteria:
- User can register an account
- User can log in
- User can log out
- Authentication state is maintained

### REQ-7 — Admin Dashboard

The system shall provide an administrative interface for managing bookings and system data.

Acceptance criteria:
- Administrator can access protected admin pages
- Administrator can view booking information
- Administrator can perform administrative actions
- Access is restricted to authorized users only

Current status:
Partially fulfilled. Basic implementation exists locally, but the complete functionality has not been deployed and therefore does not fully meet all acceptance criteria.

---

## Non-Functional Requirements

### NFR-1 — Performance
The system shall respond quickly to user actions.

Acceptance criteria:
- Pages load within 2 seconds
- Chat messages are delivered instantly
- No noticeable delays during navigation

---

### NFR-2 — Usability
The system shall be easy to use and understand.

Acceptance criteria:
- Navigation is clear and simple
- Users can use the system without instructions
- Interface is consistent across pages

---

### NFR-3 — Security
The system shall protect user data and prevent unauthorized access.

Acceptance criteria:
- User data is stored securely
- Only authorized users can access data
- No sensitive data is exposed

---

### NFR-4 — Compatibility
The system shall work on different devices and browsers.

Acceptance criteria:
- Works on desktop and mobile devices
- Works in modern browsers (Chrome, Edge, Safari)
- Layout adapts to screen size

---

### NFR-5 — Reliability
The system shall function without crashes or errors.

Acceptance criteria:
- System does not crash during normal use
- Errors are handled properly
- Users receive feedback if something goes wrong

---

### NFR-6 — Maintainability
The system shall be easy to maintain and update.

Acceptance criteria:
- Code is structured and organized
- Changes can be made without breaking the system
- Features can be extended easily

---

### NFR-7 — Availability
The system shall be available when users access it.

Acceptance criteria:
- System is accessible online
- Minimal downtime
- Users can access the system at any time