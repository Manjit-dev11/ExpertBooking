<div align="center">
  <img src="assets/icon.png" alt="Logo" width="120" style="border-radius: 24px; margin-bottom: 16px;" />
  
  # ExpertBooking
  
  **A premium, full-stack platform connecting users with top professionals for 1:1 sessions.**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?logo=react)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-51-black?logo=expo)](https://expo.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-API-000000?logo=express)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)](https://mongodb.com/)
</div>

<br />

## 🌟 Overview
**ExpertBooking** is a beautifully crafted mobile application designed to seamlessly bridge the gap between people seeking knowledge and top-tier experts. Built with a modern dark-themed aesthetic, fluid animations, and real-time connectivity, it provides an unparalleled user experience from discovery to booking.

## 🚀 Tech Stack

### Frontend (Mobile App)
* **Framework:** React Native & Expo Router (File-based routing)
* **Language:** TypeScript
* **Animations:** React Native Reanimated
* **Styling:** Custom Design System (Premium Dark Theme, Glassmorphism)
* **Data Fetching:** Axios & Custom React Hooks
* **Form Handling:** React Hook Form & Zod

### Backend (API)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Real-time Sync:** Socket.io (for instant slot synchronization)
* **Pagination:** Mongoose-Paginate-V2

---

## 🏗 System Architecture

The platform operates on a decoupled **Client-Server Architecture**:
1. **Presentation Layer (Expo Client):** Handles immersive UI/UX, conditional animations (like our custom animated splash screen), and global state.
2. **Application Layer (Express Server):** Contains the core business logic, structured route controllers, strict data validation middleware, and WebSockets.
3. **Data Layer (MongoDB):** A flexible NoSQL database storing curated expert profiles, dynamic availability slots, and immutable booking records.

### Logic & Workflow
* **Discovery & Pagination:** The mobile app queries the backend `/experts` API using infinite-scroll logic, loading 10 profiles at a time for optimal performance.
* **Booking Ecosystem:** Users filter by category, view rich expert profiles, and select available time slots.
* **Real-Time Engine:** When a booking is confirmed, Socket.io broadcasts the updated slot availability, instantly disabling that specific time slot for all other active users without requiring a pull-to-refresh.

---

## 📸 Application Showcase

Here is a glimpse of the premium interface and user flows:

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="photos/img1.jpeg" width="220" alt="Screen 1" style="border-radius:12px;"/></td>
      <td align="center"><img src="photos/img2.jpeg" width="220" alt="Screen 2" style="border-radius:12px;"/></td>
      <td align="center"><img src="photos/img3.jpeg" width="220" alt="Screen 3" style="border-radius:12px;"/></td>
      <td align="center"><img src="photos/img4.jpeg" width="220" alt="Screen 4" style="border-radius:12px;"/></td>
    </tr>
    <tr>
      <td align="center"><img src="photos/img5.jpeg" width="220" alt="Screen 5" style="border-radius:12px;"/></td>
      <td align="center"><img src="photos/img6.jpeg" width="220" alt="Screen 6" style="border-radius:12px;"/></td>
      <td align="center"><img src="photos/img7.jpeg" width="220" alt="Screen 7" style="border-radius:12px;"/></td>
      <td align="center"><img src="photos/img8.jpeg" width="220" alt="Screen 8" style="border-radius:12px;"/></td>
    </tr>
  </table>
</div>

## 📱 Download

<div align="center">
  <a href="./Booking System APP.apk">
    <img src="https://img.shields.io/badge/Download-Android%20APK-000926?style=for-the-badge&logo=android&logoColor=white" alt="Download Android APK" />
  </a>
  <p><i>Direct link to the production build for Android devices.</i></p>
</div>
---

## ⚡ Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB Instance (Local or Atlas)
* Expo CLI (`npm i -g expo-cli`)

### 1. Clone the repository
```bash
git clone https://github.com/Manjit-dev11/ExpertBooking.git
cd ExpertBooking
```

### 2. Setup Backend
```bash
cd expert-booking-backend
npm install

cp .env.example .env

# Start the server
npm start
```

### 3. Setup Frontend
```bash
# Return to the project root
cd ..
npm install

# Start the Expo development server
npx expo start
```

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).
