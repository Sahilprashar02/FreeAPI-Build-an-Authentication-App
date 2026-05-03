<div align="center">
  <img src="public/logo.png" alt="AuthFlow Logo" width="120" style="border-radius: 24px; margin-bottom: 20px;" />
  <h1>🔐 AuthFlow</h1>
  <p><strong>A Premium Authentication Experience built with FreeAPI</strong></p>

  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
</div>

---

## 🚀 Overview
AuthFlow is a sophisticated, vanilla JavaScript authentication application. It demonstrates a complete authentication lifecycle including registration, login, profile management, and session termination, all powered by the **FreeAPI Authentication Module**.

## ✨ Features
- **Modern UI**: A premium dark-mode aesthetic with glassmorphism and smooth animations.
- **Full Auth Flow**: Seamless registration, login, and logout.
- **Session Management**: Persistent sessions using token-based authentication (Bearer token).
- **Profile Dashboard**: Real-time display of currently logged-in user details.
- **Robust Feedback**: Detailed success/error messages and intuitive loading states.
- **Responsive Design**: Optimized for all devices, from desktop to mobile.

## 🛠️ Tech Stack
- **Core**: Vanilla JavaScript (ES6+)
- **Styling**: Vanilla CSS (Modern Grid/Flexbox, Backdrop Filters)
- **Tooling**: Vite (Dev Server & Build Tool)
- **API**: [FreeAPI](https://freeapi.app/)

## 📡 API Integration
The application interacts with the following FreeAPI endpoints:
- `POST /users/register`: Create a new user account.
- `POST /users/login`: Authenticate user and receive access tokens.
- `GET /users/current-user`: Fetch private profile data.
- `POST /users/logout`: Terminate the active session.

## 💻 Run Locally

1. **Clone the repository**
   ```bash
   git clone git@github.com:Sahilprashar02/FreeAPI-Build-an-Authentication-App.git
   cd FreeAPI-Build-an-Authentication-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📝 Implementation Note
To resolve common CORS issues with credentialed requests on public APIs, this application implements **Token-Based Authentication**. Upon successful login, the `accessToken` is securely stored in `localStorage` and included in the `Authorization: Bearer <token>` header for all subsequent private requests.
