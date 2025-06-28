# 🧠 Smart Lost & Found System (AI-Integrated) 🎒

A modern, AI-powered Lost and Found management system designed for institutions (schools, colleges, offices) to streamline the process of reporting found items and verifying rightful claims — with built-in email OTP authentication and AI assistance.

---

## 🚀 Features

### 🔐 Authentication
- Secure **user registration & login** with **JWT**.
- **Email OTP Verification** (via Redis) to block fake or invalid registrations/logins.

### 📦 Found Item Management
- Post found items with:
  - Auto-filled user identity (name/contact).
  - **AI-summarized descriptions**.
  - **AI-predicted category tags**.
- View all found items or filter by category.
- Track **your personal found posts**.
- Delete items only if still unresolved (pending).

### 📨 Claim System
- Claim on found items with description + proof.
- View all claims on a particular item.
- **Claim approval system**:
  - Approve one → auto-reject others.
  - Updates item status to "Resolved".
  - Adds returned date & person’s info.
- Option to **reject individual claims**.

### 🧠 AI Features
- 💬 **Summarization** of item descriptions.
- 🏷️ **Automatic tag detection** (e.g., Electronics, Books).
- 🤖 **AI ranking of multiple claims** to assist in identifying the best match.

### 📥 Returned Item Listing
- Filter found items where `status === "Resolved"`.

---

## 🛡️ Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT + Bcrypt
- **OTP Storage:** Redis
- **Email Service:** Nodemailer (Gmail)
- **AI:** (OpenAI / Gemini) for NLP tasks
- **Deployment:** (Ready for Render / Railway)

---

## 🧩 Folder Structure (Backend)

