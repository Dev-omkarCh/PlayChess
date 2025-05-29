# PlayChess

PlayChess is a modern, real-time multiplayer chess game built with React, Node.js, and Socket.io. It allows players to compete in online chess matches, track their game history, and analyze their performance.

---

## **Features**

### **Core Features**
- **Multiplayer Chess**: Play real-time chess matches with other players.
- **Random Matchmaking**: Automatically pair players for games.
- **Game History**: Track and review completed games.
- **User Profiles**: Manage accounts and view player stats.
- **Leaderboards**: Compete for the top spot on the global leaderboard.
- **preferrences**: user can customize the app with game theme, pieces, board color and some additional settings.

## **Tech Stack**

### **Frontend**
- **React**: For building the user interface.
- **TailwindCSS**: For modern and responsive styling.
- **Vite**: For fast development and build processes.
- **Zustand**: Its state management library.

### **Backend**
- **Node.js**: For server-side logic.
- **Express.js**: For API and routing.
- **Socket.io**: Library for real-time communication.
- **MongoDB**: For database storage.

---

# **Demonstration**

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

### **7. Profile**

![lose](./frontend/src/assets/preview/profilePage.png)

### **8. Random Matchmaking**
![lose](./frontend/src/assets/preview/matchMakingPage.png)



---


### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

#### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/PlayChess.git
cd PlayChess
```

#### **2. Install Dependencies**
- **Frontend**:
  ```bash
  cd frontend
  npm i lucide-react react-router-dom axios socket.io-client zustand path
  npm i chart.js clsx react-dnd react-dnd-html5-backend  tailwind-merge class-variance-authority react-hot-toast
  ```
- **Backend**:
  ```bash
  cd backend
  npm i express dotenv cors bcryptjs cookie-parser jsonwebtoken mongoose path socket.io
  npm i nodemon -D
  ```

#### **3. Configure Environment Variables**
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=4000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

#### **4. Start the Application**
- **Backend**:
  ```bash
  cd backend
  npm run server
  ```
- **Frontend**:
  ```bash
  cd frontend
  npm run dev
  ```

## **Future Enhancements**
- **Spectator Mode**: Allow users to watch ongoing games.
- **AI Opponent**: Add a single-player mode with AI.
- **Chat System**: Enable in-game chat between players.
- **Game Replay**: Replay completed games move by move.

---

## **Contact**
For questions or feedback, feel free to reach out:
- **Email**: omkarchikhale.dev@gmail.com
- **LinkedIn**: [linkedin.com/in/omkar-chikhale/](https://www.linkedin.com/in/omkar-chikhale/)


