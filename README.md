# CodeHive

CodeHive is a modern fullstack web application where developers and clients can connect, communicate and collaborate.

The platform includes:
- Developer profiles
- Live realtime chat
- Booking system
- Authentication
- Admin panel
- Responsive mobile navigation
- Docker deployment

---

# Live Demo

Deployed version:

https://codehive-1-quqk.onrender.com/
http://cu0163.camp.lnu.se

---

# Technologies

Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Node.js
- Express

Database:
- MongoDB
- Firebase Firestore

Authentication:
- Firebase Authentication

Deployment:
- Docker
- Docker Compose
- Nginx
- Ubuntu VPS

CI/CD:
- GitLab Pipelines

---

# Features

## User Features
- Browse developer profiles
- Book meetings
- Realtime private chat
- Responsive mobile UI
- Login and registration

## Admin Features
- View bookings
- Protected admin route

---

# Responsive Design

The application is optimized for:
- Desktop
- Tablet
- Mobile devices

Includes:
- Hamburger navigation menu
- Mobile layout
- Responsive sections

---

# Project Structure

```bash
src/
 ├── .volumes/
 ├── .vscode/
 ├── .dist
 ├── node_modules/
 ├── public/
 ├── src/
 .env
 .eslintrc.json
 .gitignore
 .gitlab.ci-yml
 docker-compose.development.yaml
 docker-compose.production.yaml
server.js
Dockerfile
Dockerfile.production
index.html
package-lock.json
package.json
README.md
server.js

Run Locally

Clone repository:

git clone <repo-url>

Install dependencies:

npm install

Start development server:

npm run dev

⸻

Docker Deployment

Build and run:

docker compose -f docker-compose.production.yaml up -d --build

Restart nginx:

sudo nginx -t
sudo systemctl restart nginx

⸻

Testing

Tested functionality:

* Navigation
* Authentication
* Chat system
* Booking API
* Responsive layout
* Docker deployment

Manual testing has been performed on:

* Chrome
* Mobile responsive mode

⸻

Ethical Considerations

The project considers:

* User privacy
* Secure authentication
* Protected admin functionality
* Safe handling of user data

Sensitive information such as passwords and API keys are not exposed publicly.

⸻

Current Status

Implemented:

* Full frontend UI
* Backend API
* Authentication
* Live chat
* Responsive navigation
* Deployment pipeline

Future Improvements:

* Better chat UX
* Notifications
* Profile editing
* Search/filter developers
* Improved accessibility

⸻

Authors

Sofie Söderberg
Linnaeus University
Software Development Project (1DV613)

