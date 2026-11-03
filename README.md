# 🧠 StickyBrain

> A little corner for big ideas and unfinished thoughts.

StickyBrain is a full-stack web application designed for pinning ideas, thoughts, and experiments to an interactive wall. Community members can react with expressive emojis and engage in discussions.

---

## ✨ Features

- **Sticky Note Wall**: Interactive visual board with dynamic tilts, sticky note colors, categories, and author badges.
- **Emoji Reactions**: Express feelings on ideas (👍 Like, ❤️ Love, 🤔 Interesting, 💡 Inspired) with real-time counters.
- **Threaded Conversations**: Comment system with author attribution and timestamps.
- **Custom Authentication**: Cookie-based session authentication with hashed tokens, bcrypt password hashing, and PostgreSQL persistence.
- **Modern Stack**: Built with Next.js (App Router), Tailwind CSS v4, PostgreSQL (`pg`), and Zod validation.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file with your PostgreSQL connection string:
```env
DATABASE_URL=your_postgresql_connection_string
```

### 3. Initialize the Database
Trigger the database initialization endpoint:
```bash
POST /api/init-db
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
