<!-- Technology Tags -->

<div align="center">
  <div>
    <img src="https://img.shields.io/badge/-React_Js-black?style=for-the-badge&logoColor=58c4dc&logo=react&color=000000" alt="reactJs" />
    <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logoColor=white&logo=tailwindcss" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="socket.io" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="mongodb" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="expressjs" />
  </div>
  <h2 align="center"> ♟️Multiplayer Chess Game</h2>

   <div align="center">
     An interactive, real-time multiplayer chess game built with the MERN stack and Socket.io. Play classic chess with your friends, track game state in real-time, and enjoy a responsive UI.
    </div>
</div>


## 📚 Table of Contents

- [📖 Introduction](#introduction)  
- [🛠 Tech Stack](#tech-stack)  
- [✨ Features](#features)  
- [📸 Demonstration](#demonstration)  
- [🚀 Project Start Guide](#project-start-guide)  
- [🪛 Future Enhancements](#Future-Enhancements)
- [👨‍💻 Author](#author)  
- [🔗 Socials](#socials)

---

<a id="introduction"></a>
## 📖 Introduction

This MERN Chess Game allows two players to connect and play a full game of chess in real-time using Socket.io. The goal is to demonstrate both real-time bi-directional communication using Socket.io and complex game logic like chess move validation, check/checkmate detection, and multiplayer syncing.


PlayChess is a modern, real-time multiplayer chess game built with React, Node.js, and Socket.io. It allows players to compete in online chess matches, track their game history, and analyze their performance.

---

<a id="tech-stack"></a>
## 🛠 Tech Stack

**Frontend:**
- React.js
- TailwindCSS
- Axios
- React Router
- Socket.io-client
- zustand

**Backend:**
- Node.js
- Express.js
- MongoDB (optional for game history or matchmaking)
- Socket.io
- bcryptjs & JWT (for authentication)

---

<a id="features"></a>
## ✨ Features

- ♟️ Classic two-player chess gameplay  
- 🔄 Real-time multiplayer via Socket.io  
- ✅ Valid chess move rules + turn management  
- 📋 Leaderboard system with ELO ratings  
- 🧑 User profiles with bio, avatar, and stats  
- 🕓 Game history (wins, losses, draws, opponents)  
- 📊 Match analytics (opening, duration, result, mistakes)  
- ⚙️ Account settings and preferences  
- 🎯 Random matchmaking based on ELO rating  
- 🌐 Secure game rooms via room IDs  
- 📱 Responsive design with dark mode support

---

<a id="demonstration"></a>
## 📸 Demonstration

### **1. Landing Page**

![Home Page](./frontend/src/assets/preview/landingPage.png)

### **2. Authentication Page**

![Authentication](./frontend/src/assets/preview/authPage.png)

### **3. Game Lobby**

![Game lobby](./frontend/src/assets/preview/menuPage.png)

### **4. Invite Friend Page**
Can Send & Accept friend or game request

![Invite Friend](./frontend/src/assets/preview/InviteFriendPage.png)

#### Invite Friend page contains functionalities :-

1. **Inbox** : 
Inbox contains all the request from other player, it can be friend request and Game request.

![Inbox](./frontend/src/assets/preview/notificationBox.png)
***

2. **Message box** :
Message box contains all the message of actions like accepted a friend request and send a friend request.

![Inbox](./frontend/src/assets/preview/MessageDailog.png)
***

3. **Online friends** :
Shows all online friends. If friend is online, then only you can send a game request to your friend.

![Inbox](./frontend/src/assets/preview/online.png)
***

4. **Search friends** :
Shows all online friends. If friend is online, then only you can send a game request to your friend.

![Inbox](./frontend/src/assets/preview/searchFriend.png)

### **5. Game Page**

![Inbox](./frontend/src/assets/preview/game.png)

### **6. Result Model**

![won](./frontend/src/assets/preview/won.png)

![lose](./frontend/src/assets/preview/lose.png)

### **7. Leaderboard**
![lose](./frontend/src/assets/preview/leaderboard.png)

### **8. Profile**
![lose](./frontend/src/assets/preview/profilePage.png)

### **9. Random Matchmaking**
![lose](./frontend/src/assets/preview/matchMakingPage.png)

<a id="project-start-guide"></a>
## 🚀 Project Start Guide

### Prerequisites

- Node.js and npm installed
- MongoDB running locally or a cloud DB URI (e.g., MongoDB Atlas)

### Clone the repository

```bash
git clone https://github.com/Dev-omkarCh/PlayChess.git
cd play-chess
```
### Backend setup
```bash
cd backend
npm i express mongoose cors jsonwebtoken bcryptjs cookie-parser
npm i nodemon -D
npm run server
```

### Frontend Setup
```bash
cd frontend
npm create vite@latest .
npm i react-router-dom react-icons axios zustand 
npm run dev
```
### Tailwind Css Setup
```bash
npm install tailwindcss @tailwindcss/vite
npx tailwindcss init # if not works, create the file: tailwind.config.js
```

### Environment Variables
Create a .env file inside the server/ directory with the following keys:
```.env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
<a id="Future-Enhancements"></a>
## 🪛 Future Enhancements

- **Spectator Mode**: Allow users to watch ongoing games.
- **AI Opponent**: Add a single-player mode with AI.
- **Chat System**: Enable in-game chat between players.
- **Game Replay**: Replay completed games move by move.


<a id="author"></a>

## 👨‍💻 Author

- Omkar Chikhale
- omkarchikhale.dev@gmail.com 📧

<a id="socials"></a>

## 🔗 Socials
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/omkar-chikhale/)  
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/your-username)  
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/om.kar816?igsh=MWd5dDF5bGd5ejFpMw==)  
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/profile.php?id=100087449895467&amp;mibextid=ZbWKwL)

> 



