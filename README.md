# 🏔️ Islamabad Vibes - AI Deals, Margalla Treks & Community Super-App

An AI-powered lifestyle, discounts, hiking community & food therapy super-application built specifically for Islamabad capital territory citizens, university students (NUST, FAST, QAU, COMSATS, Bahria), and visitors.

---

## 🌟 Key Features

### 1. 🍔 Comprehensive Islamabad Deals & Restaurants
- Covers key capital sectors: **F-6 (Kohsar & Beverly Centre)**, **F-7 (Jinnah Super)**, **F-10 Markaz**, **F-11 Markaz**, **Blue Area**, **I-8 Markaz**, **Centaurus Mall**, **Margalla Hills & Monal**, and **Bahria & DHA**.
- Authentic verified deals from **Cheezious**, **Savour Foods**, **The Monal**, **Chaaye Khana**, **Ranchers Cafe**, **Tehzeeb Bakers**, **Street 1 Cafe**, **Kabul Restaurant**, **Asian Wok**, and **Daily Deli Co.**
- Real-time discount calculations, student bonuses, and direct restaurant ordering links.

### 2. 🛒 Interactive 3D Flying Smart Basket & Mart Groceries
- Dynamic flying product physics when adding deals or mart grocery packages to the basket.
- Real-time savings breakdown with Islamabad Student Pass (-10% extra).
- Mart bundles from **Metro Cash & Carry**, **Imtiaz Super Market**, **Al-Fateh**, and **Esajee's Kohsar Market**.

### 3. 🤖 Islamabad AI Dost & Food Therapist (NLP, DL & CV)
- **Empathetic Mental Wellness Coach**: Warm conversational therapist for stressful study days, loneliness in hostels, or life advice.
- **Mood-Matched Cravings Engine**: Recommends food and tranquil Islamabad spots based on emotional telemetry.
- **Computer Vision (CV) Scanner**: Analyzes uploaded food photos or restaurant receipts, calculates estimated calories, macro distribution (protein, carbs, fats), and detects matching Islamabad discounts.
- **Bilingual Voice Synthesis**: Neural speech playback via ElevenLabs and Web Speech API.

### 4. 🏔️ Margalla Hills Trails, Running Club & Fitness
- Interactive guides for **Trail 3**, **Trail 5**, **Trail 2**, and **Trail 6** with elevation, difficulty, water points, and monkey alerts.
- Live meetups: Sunday Margalla Sunrise Summit, F-9 Park 10K Runners, and Sunset Chai Walk.
- Direct RSVP and WhatsApp community links.

### 5. 🎮 Mind Refresh Game Lounge
- **Arcade Pacman**: Full canvas maze game with Blinky, Pinky, Inky ghosts, food pellets, energizers, and scores.
- **Margalla Retro Snake**: Eat Savour Shami, Cheezious pizza slices & Karak chai cups to grow.
- **Grandmaster Chess**: Interactive 8x8 chessboard with legal move highlighting, captures rack, move history, and Islamabad AI opponent.

### 6. 💬 WhatsApp-style Community Channels & Social Network
- Join or create channels like `#isb-foodies`, `#margalla-hikers`, `#student-deals`.
- Live message feed, media attachments, and emoji reactions.
- Friend system with user profiles, friend requests, and social connections.

### 7. 📢 Citizen Voice & Consumer Rights Complaints
- File official complaints for unhygienic food, overcharging, fake discounts, or trail littering.
- Live tracking ID system (`ISB-CMP-XXXX`) with ICT resolution updates.
- Emergency speed-dial helplines: **Rescue 1122**, **Police 15**, **CDA 1819**, **ICT Food Authority 0800-02345**.

### 8. 🛡️ Admin Command & Moderation Portal
- Telemetry monitor: Active online users, total deals, active cart volume.
- User moderation: Ban/unban flagged spam accounts and remove abusers.
- Deal manager: Publish verified deals directly to Islamabad citizens.

### 9. 🌐 Live ICT Weather & Telemetry
- OpenWeather integration for real-time Margalla temperature, wind, humidity, and air quality index.
- Live currency and commodity ticker (USD/PKR, Gold per Tola, Petrol per Litre).
- Instant Urdu (اردو) and English bilingual localization.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm / pnpm / yarn

### Installation
```bash
git clone <repo-url>
cd dislo
npm install
```

### Configure Environment (.env)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Run Locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## ☁️ Deployment (Vercel)
The project includes a ready `vercel.json` config:
1. Push code to GitHub.
2. Import repository in [Vercel](https://vercel.com).
3. Set environment variables from `.env`.
4. Deploy!
