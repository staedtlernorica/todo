# Kandoban

**Kandoban** is a mobile-first, browser-based to-do app with a kanban-style interface. It’s designed for speed, simplicity, and managing recurring tasks — with zero friction.

> 💡 **Try it live:** [kandoban.netlify.app](https://kandoban.netlify.app)

---

## 🚀 Why Kandoban?

Kandoban was built to eliminate the overhead of traditional to-do apps. No downloads. No mandatory accounts. No switching between apps just to take a note.

Just visit the URL and start jotting things down — instantly.

---

## ✨ Features

- 🗂️ **Two-Board Kanban System**:  
  Organize tasks across a **To Do** and a **Done** board. Quickly move tasks between them based on completion or recurrence. Move finished recurring tasks to **Done** — and bring them back to **To Do** whenever they need to be tackled again.

- 📝 **Flexible Task Input**:
    - Create, edit, and delete tasks from either board
    - Tasks are **copyable** for easy reuse  
    - Supports **multiline text** entries  

- 💾 **Offline-First with localStorage**:  
  Your tasks are saved directly in the browser — no sign-in needed, and they persist until you remove them.

- ☁️ **Optional Google Sign-In with Cloud Sync**:  
  Sign in with your Google account to sync tasks across devices using Firebase.  
    - Your existing local data is automatically synced  
    - Strong privacy: your data is protected via Firebase security rules

- 📱 **Mobile-First Design**:  
  Built to feel great on phones, but scales well to desktop too.

- 🎨 **Animated, Polished UX**:
  Animated user interactions that take cues from familiar patterns of modern web apps — making interactions feel fast, responsive, and intuitive.

- 🌐 **Zero-Install Web App**:  
  Access from any browser — no downloads or switching between apps. It's faster than opening your phone’s notes app.

---

## 🛠️ Tech Stack
- **Frontend**: React, Material UI  
- **Authentication & Sync**: Firebase Auth + Firestore  
- **Storage**: Browser `localStorage` and optional Firebase sync

---

## 💻 Getting Started Locally (Optional)

You can run Kandoban locally if you’d like to explore or contribute:

```bash
git clone https://github.com/your-username/kandoban.git
cd kandoban
npm install
npm start
