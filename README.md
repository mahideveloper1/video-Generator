# 🎥 AI-Powered Personalized Video Generator

A full-stack application that generates personalized videos with AI-powered voice cloning and lip-sync, then delivers them directly to users via WhatsApp.

---

## ✨ Features
- 🎤 **AI Voice Generation** – Generate natural-sounding voice using **ElevenLabs API**  
- 💋 **Lip-Sync Technology** – Sync generated audio with video using **SyncLabs API**  
- 📱 **WhatsApp Integration** – Automatic video delivery via **Twilio WhatsApp API**  
- 🗄️ **Database Tracking** – Complete request/response logging in **PostgreSQL**  
- 🐳 **Dockerized** – Easy deployment with **Docker Compose**  
- 🎨 **Modern UI** – Clean, responsive frontend with **Next.js + TailwindCSS**  
- 🔐 **Type-Safe** – Full **TypeScript** implementation  

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** – React framework with App Router  
- **TypeScript** – Type-safe JavaScript  
- **TailwindCSS** – Utility-first CSS framework  
- **React Hooks** – Modern state management  

### Backend
- **Express.js** – Node.js web framework  
- **TypeScript** – Type-safe backend  
- **Prisma ORM** – Database toolkit  
- **PostgreSQL** – Relational database  

### APIs & Services
- **ElevenLabs** – AI voice generation  
- **SyncLabs** – Video lip-sync  
- **Twilio** – WhatsApp messaging  

### DevOps
- **Docker** – Containerization  
- **Docker Compose** – Multi-container orchestration  

---

## 1. Set up 

Your project contains a frontend folder and backend folder

# Backend repo
- cd backend
- npm install
- npm run dev

# Frontend repo
- cd frontend
- npm install
- npm run dev

# running from docker 
docker-compose up --build

# set up .env file in root folder and backend folder

# ElevenLabs
- ELEVENLABS_API_KEY=your_elevenlabs_api_key
- ELEVENLABS_VOICE_ID=your_voice_id

# SyncLabs
- SYNCLABS_API_KEY=your_synclabs_api_key
- BASE_VIDEO_URL=https://example.com/video.mp4

# Twilio WhatsApp
- TWILIO_ACCOUNT_SID=your_twilio_sid
- TWILIO_AUTH_TOKEN=your_twilio_auth_token
- TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Database
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require&channel_binding=require"

# Server
- NODE_ENV=production
- PORT=3001
- BASE_URL=http://localhost:3001

- NEXT_PUBLIC_API_URL=http://localhost:3001
