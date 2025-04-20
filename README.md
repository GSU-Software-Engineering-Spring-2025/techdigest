# 🚀 TechDigest Team Onboarding & Contribution Guide

Welcome to the **TechDigest GitHub Organization (GSU-Software-Engineering-Spring-2025)**! This guide will show you how to join the project, collaborate smoothly, and contribute effectively. Whether you're on the **Backend Team**, **AI Integration Team**, or the **Frontend Team**, this document outlines everything you need to know.

---

## 🔗 Project Access

### 🌐 Frontend App (Live Preview)

https://techdigest.netlify.app/

_Only the frontend is currently live. We're connecting it to backend and AI services within the next 24 hours._

---

## 👥 Teams Overview

We are working in three primary teams:

-   **Backend Team** – Handles API routes, authentication, and database logic
-   **AI Integration Team** – Connects the app to OpenAI/HuggingFace for article summarization
-   **Frontend Team** – Continues to fine-tune the user interface and user experience across the app

Each team member will work on features assigned to their group.

---

## 🧑‍💻 How to Get Started

### What Does It Mean to Clone a Repo?

Cloning means you're copying the entire codebase from GitHub to your local computer so that you can start working on it. This gives you your own local version of the project that you can edit, run, and push updates from.

### 1. Clone the Repository

```bash
git clone https://github.com/GSU-Software-Engineering-Spring-2025/techdigest.git
cd techdigest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

---

## 🔁 Contribution Workflow

### ✅ Step-by-Step Process

1. **Create Your Own Branch**

    - Format: `backend-full-name`, `ai-full-name`, or `frontend-full-name`
        - Examples: `backend-samuel-james`, `ai-anita-okafor`, `frontend-kenny-lee`

    ```bash
    git checkout -b backend-your-name
    ```

    > `git checkout -b` creates a new branch and switches to it.

2. **Work & Commit Regularly**

    ```bash
    git add .
    git commit -m "Add feature X"

    # First time pushing your branch to GitHub:
    git push -u origin your-branch-name

    # After that, just use:
    git push
    ```

    > The `-u` flag links your local branch with the remote one so that future pushes can be done with just `git push`.

3. **Keep Your Branch Up to Date Before Pull Request**

    ```bash
    git checkout main
    git pull origin main
    git checkout your-branch
    git merge main
    ```

    > This ensures your branch includes any recent changes from others, so you don't accidentally overwrite someone’s work.

4. **Open a Pull Request (PR)**

    - Go to GitHub > Compare & Pull Request
    - Add a description of your changes
    - Submit for review

5. **Get Approval**

    - Only uthorized reviewers will approve PRs

6. **Merging to Main**
    - Pull requests will be merged only after approval
    - No one should push directly to `main` branch ❌

---

## 🔐 GitHub Branch Protection

We will enable a protection rule on the `main` branch:

-   Direct pushes are **not allowed**
-   Pull requests must be reviewed and approved by the authorized reviewers before merging

---

## 📦 Best Practices

-   Use clear, descriptive commit messages
-   Always sync your branch with `main` before making a pull request
-   Communicate if you are working on a shared file or feature
-   Pull frequently to avoid conflicts:
    ```bash
    git pull origin main
    ```

---

## ✉️ Haven’t Been Added / Invited to Github Yet?

Send your GitHub email to the GroupMe to be added to the organization.

---

## 🧠 Final Notes

-   We are on a tight deadline – please work efficiently and collaboratively
-   Ask questions early, especially if you're unsure about Git or your task
-   We are building this together – let’s ship something great! 💪🏽

---
