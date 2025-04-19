Here's a cleaned-up, professional version of your README file — all references to Lovable have been removed, and it's now focused on collaboration, local development, and deployment, ready for GitHub:

---

# 📰 TechDigest – Technology News Web App

TechDigest is a fully responsive web application that delivers curated technology news categorized by subfields like AI, ML, and Robotics. It features AI-powered article summarization, user authentication, filtering, and dynamic interaction tracking — built with a modern full-stack architecture.

---

## 🚀 Project Info

This repository contains the **frontend** for TechDigest, built using:

-   [React](https://react.dev/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Vite](https://vitejs.dev/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [shadcn/ui](https://ui.shadcn.com/)

---

## 📦 How to Set Up the Project Locally

Make sure you have **Node.js** and **npm** installed. You can use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage Node versions.

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

### 2. Navigate to the project directory

```bash
cd techdigest-frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The app will start at `http://localhost:5173` (or another available port). The terminal will tell you the exact address.

---

## 🧑‍💻 How to Contribute

This is a collaborative project! Here’s how you can contribute:

1. **Fork the repository**
2. **Create a new branch**:  
   `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Commit and push**:  
   `git commit -m "Add: your descriptive message"`  
   `git push origin feature/your-feature-name`
5. **Open a Pull Request** describing your changes

### 🗂 Branch Naming Conventions

| Branch Type | Prefix         |
| ----------- | -------------- |
| New Feature | `feature/`     |
| Bug Fix     | `fix/`         |
| Enhancement | `enhancement/` |
| UI Updates  | `ui/`          |

---

## 🧠 Project Highlights

-   Category-based tech news layout
-   Sorting by title or date
-   AI-generated article summaries (API TODOs in place)
-   Like/view/dislike tracking
-   Authentication (login/signup) with mock state
-   Sidebar navigation
-   Fully responsive design

---

## 🌐 Deployment

You can deploy this project using any modern frontend hosting platform like:

-   [Vercel](https://vercel.com/)
-   [Netlify](https://netlify.com/)
-   [Render](https://render.com/)

Simply connect your GitHub repository and set the **build command** to:

```bash
npm run build
```

And set the **output directory** to:

```bash
dist
```

---

## 📁 Folder Structure

```
/src
├── components/     # Reusable UI components
├── pages/          # Main pages (Home, Login, Article, etc.)
├── layouts/        # Layout wrappers
├── data/           # Dummy/mock data
├── hooks/          # Custom React hooks
├── context/        # Context API for global state
└── utils/          # Utility functions
```

---

## 🛠 Tech Stack Summary

| Category         | Tools / Frameworks                      |
| ---------------- | --------------------------------------- |
| Frontend         | React, TypeScript, Vite                 |
| Styling          | Tailwind CSS, shadcn/ui                 |
| State Management | React Context, Hooks (Zustand optional) |
| Routing          | React Router                            |

---

## 📌 Notes

-   All backend/API interactions are marked with `// TODO:` comments.
-   This repo focuses only on the **frontend**. The backend, AI summarization service, and database integration are handled separately.

---

Let me know if you’d like a `CONTRIBUTING.md`, issue templates, or GitHub Actions for linting/prettier!
