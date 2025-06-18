# 🎬 myFlix Angular Client

This project is a **single-page web application** built with Angular that allows users to browse movies, register an account, update their profile, and manage a list of favorite movies. It communicates with a RESTful API built with Node.js and hosted on Heroku.

---

## 📦 Features

- ✅ User registration and login
- ✅ View all movies from the database
- ✅ Filter movies by genre or director
- ✅ Add and remove movies from favorites
- ✅ Edit user profile
- ✅ Delete user account
- ✅ Protected routes using token-based authentication
- ✅ Styled with Angular Material

---

## 🚀 Technologies Used

- Angular 15+
- TypeScript
- Angular Material
- RxJS
- Angular CLI
- REST API (Node.js + Express + MongoDB)

---

## 🌐 Live Demo

Frontend: [https://myflixsiteapp.netlify.app](https://myflixsiteapp.netlify.app)  
Backend API: [https://movies-my-flix-app-60bc918eee2b.herokuapp.com/](https://movies-my-flix-app-60bc918eee2b.herokuapp.com/)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/         # UI components
│   ├── services/           # API service (FetchApiDataService)
│   ├── interfaces/         # TypeScript interfaces
│   ├── app.module.ts       # App module config
│   └── app.component.ts    # Root component
├── assets/
└── index.html
```

---

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/myFlix-Angular-client.git
   cd myFlix-Angular-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   ng serve
   ```

4. Open your browser and go to `http://localhost:4200`

---

## 🛡️ Authentication

- Token-based authentication using `Bearer <token>` headers.
- Tokens are stored in `localStorage`.

---

## ✍️ Author

- **Daniel** – Web Developer  
- Originally from **Colombia**, currently based in the **U.S.**

---

## 📜 License

This project is part of the CareerFoundry Full-Stack Web Development Program. Feel free to reuse for educational purposes.