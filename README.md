# Placement Preparation Portal

Made by Team: Code Craft!!!

## What's inside

- **Home page** — built with **React** (`src/Home.jsx`).
- **All other pages** (Aptitude, Programming, Core, HR, About, Modules, Practice, Quiz) — plain HTML/CSS/JS(`index.html`, `script.js`, `styles.css`).
- **Login / Sign up / Forgot password** — stored in the browser's `localStorage` as JSON (`src/auth.js`).
  Passwords are salted and hashed (PBKDF2), but this is a front-end prototype: data lives only in the
  visitor's own browser and is **not** real security. Replace `src/auth.js` with a real backend later.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Project structure

```
index.html        page shell + all non-home views
styles.css        theme and styles (shared by every page)
script.js         router, header/footer, module pages, practice, quiz, auth forms
src/main.jsx      mounts the React home page
src/Home.jsx      React home page
src/data.js       module content shared by React and the other pages
src/auth.js       localStorage accounts (JSON)
```

## Where accounts are stored

Open DevTools → Application → Local Storage:

| Key          | Contents                                   |
|--------------|--------------------------------------------|
| `cc-users`   | JSON array of accounts (name, email, salt, hash) |
| `cc-session` | the signed-in user                         |
| `cc-resets`  | short-lived password reset tokens          |
| `cc-theme`   | light / dark preference                    |
