🧠 Smart Lost & Found System (AI-Integrated) 🎒
A modern, full-stack Lost and Found management system designed for institutions (colleges, schools, offices) — streamlining the process of reporting found items and verifying rightful claims using smart automation, email OTP authentication, and integrated AI-powered decision making.

🚀 Features
🔐 Authentication
Secure user registration & login with JWT

Email OTP Verification via Redis to block spam or invalid users

📦 Found Item Management
Add found items with:

Auto-filled user info (name + contact)

(Planned) AI-summarized description & tag detection

Filter and manage posted found items

Delete only if item is not yet resolved

📨 Claim System
Submit claims with description + proof image

Track claims made on found items

Claim Approval Logic:

Admin approves the most valid claim

Others get auto-rejected

Item status changes to Resolved with returned date

Manual reject also supported

🤖 Integrated AI (SimPulse)
💬 AI-based similarity scoring of user claims against original found description

Enables smart claim ranking (e.g., “Accuracy: 85%”)

Admin sees ranked list to easily identify best matches

🔗 Test the SimPulse AI Model Here →

📥 Resolved Item Tracking
Filter to show only items that have been returned

🧠 SimPulse – Custom AI Model
Built using MiniLM sentence embeddings + MLP regression

Trained on 500+ real-world samples

Deployed as a Hugging Face Space

Dynamically used in backend to evaluate and rank claims for every found item

🌐 Live Demo: https://huggingface.co/spaces/abinash28/SimPulse

🛠 Tech Stack
Frontend: React + Tailwind CSS

Backend: Node.js + Express.js

Database: MongoDB Atlas

Auth: JWT + Bcrypt

OTP Service: Redis

AI: Custom-built model + Hugging Face Space API

Image Upload: Cloudinary

Deployment: Vercel (Frontend) + Render (Backend) + Hugging Face (AI)
