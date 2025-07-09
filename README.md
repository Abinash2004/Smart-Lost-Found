# 🧠 Smart Lost & Found System (AI-Integrated) 🎒

A modern, full-stack Lost and Found management system designed for institutions (colleges, schools, offices) — streamlining the process of reporting found items and verifying rightful claims using smart automation, email OTP authentication, and integrated AI-powered decision making.

> 🌐 **Live Site**: [https://smart-lost-found-frontend.onrender.com](https://smart-lost-found-frontend.onrender.com)  
> 🤖 **Test the AI Model**: [https://huggingface.co/spaces/abinash28/SimPulse](https://huggingface.co/spaces/abinash28/SimPulse)

---

## 🚀 Features

### 🔐 Authentication
- Secure user registration & login with **JWT**
- **Email OTP verification** using Redis (Upstash) to prevent spam and fake accounts

### 📦 Found Item Management
- Add found items with auto-filled user info (name & contact)
- View, filter, and manage posted items
- Items can be deleted only if not marked as resolved
- *(Planned)*: AI-generated description summary and category tags

### 📨 Claim System
- Users can submit claims with descriptions and image proof
- Claims tracked per user and item
- **Approval Workflow**:
  - Admin reviews & approves one claim
  - All other claims auto-rejected
  - Found item marked as **Resolved** with `returnedDate` and `returnedTo` set
  - Manual rejection also supported

### 🤖 Integrated AI – SimPulse
- AI-powered similarity score for each claim vs original item description
- Helps admin **visually rank** most accurate claims
- Built using MiniLM embeddings + custom MLP regression model
- Returns a match percentage for each claim
- ⚡ Deployed via Hugging Face Spaces

### 📥 Resolved Item Tracking
- Filter view to show only resolved (returned) items
- Returned date and recipient name shown for each

---

## 🧠 SimPulse – Custom AI Claim Ranking Model

- Sentence-embedding model trained using:
  - `all-MiniLM-L6-v2` + `MLPRegressor`
  - 500+ real-world claim-description pairs
- Input: `found_description`, `claim_description`
- Output: Match percentage (0–100%)
- Used in backend to sort and display most likely matches first
- 💡 Built and deployed as a **modular AI microservice**

> 🔗 **Live AI Model Demo**: [SimPulse on Hugging Face](https://huggingface.co/spaces/abinash28/SimPulse)

---

## 🛠 Tech Stack

| Layer       | Tech                                                                 |
|-------------|----------------------------------------------------------------------|
| **Frontend**| React + Vite + Tailwind CSS                                          |
| **Backend** | Node.js + Express.js                                                 |
| **Database**| MongoDB Atlas                                                        |
| **Auth**    | JWT + Bcrypt                                                         |
| **OTP**     | Redis via Upstash                                                    |
| **Email**   | Nodemailer (Gmail SMTP)                                              |
| **AI**      | Custom MLP model using MiniLM + sklearn, hosted on Hugging Face      |
| **Storage** | Cloudinary for image uploads                                         |
| **Deploy**  | Render (frontend) + Render (backend) + Hugging Face (AI model)       |
