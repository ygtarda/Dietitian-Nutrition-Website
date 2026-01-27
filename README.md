# 🥗 Uzman Diyetisyen  - Professional Website

A modern, fully responsive web application designed for Expert Dietitian Gül Ödek. This project serves as a digital office, offering online appointment booking, content management for blogs/recipes, and a comprehensive admin dashboard.

## 🚀 Features

### 🌟 User Experience (Client Side)
* **Modern & Responsive UI:** Fully responsive design that works seamlessly on mobile, tablet, and desktop devices.
* **Online Appointment System:**
    * Step-by-step booking wizard (Service Selection -> Date & Time -> Contact Info).
    * Real-time availability check using Firebase Firestore.
    * Visual calendar interface.
* **Content Pages:** About Me, Services, Blog & Healthy Recipes, and Contact pages.
* **Interactive Elements:**
    * Dynamic "Smart Navbar" that hides/shows on scroll.
    * Custom toast notifications (instead of default alerts).
    * Glassmorphism effects and smooth CSS animations.
* **SEO Optimized:** Meta tags, semantic HTML structure, and dynamic document titles.

### 🛡️ Admin Dashboard (Protected)
* **Secure Login:** Hidden administrative route with authentication.
* **Appointment Management:** View, approve, or delete appointment requests.
* **CMS Capabilities:** Easy-to-use interface for updating site content.

## 🛠️ Tech Stack

* **Frontend:** React.js, TypeScript
* **Build Tool:** Vite
* **Styling:** CSS3 (Custom Modules), Responsive Design
* **Backend / Database:** Firebase (Firestore)
* **Routing:** React Router DOM
* **Notifications:** React Toastify
* **Deployment:** Vercel / Netlify / Firebase Hosting


## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/ygtarda/dietitan-nutrition-wesite.git](https://github.com/ygtarda/dietitan-nutrition-wesite.git)
    cd dietitan-nutrition-wesite
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Firebase Configuration**
    * Create a `.env` file in the root directory.
    * Add your Firebase config keys:
        ```env
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=dietitan-nutrition-wesite.firebaseapp.com
        ...
        ```

4.  **Run the project**
    ```bash
    npm run dev
    ```

## 👤 Author

**[Arda Yiğit]**
* [GitHub](https://github.com/ygtarda)
* [LinkedIn](https://www.linkedin.com/in/arda-yigit/)

