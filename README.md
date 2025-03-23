# Bank Account Management System

A complete system for managing your accounts and transactions with ease and security.



## 🌟 Live Demo

- **Frontend**: [Visit the application](https://bankingaccounts-system.vercel.app/)
- **Backend API**: [API Endpoint](https://banking-ms-backend.onrender.com)

## ✨ Features

- **User Authentication**: Secure sign-up and login functionality
- **Employee Authentication**: To create the first employee account who will then be creating other employees you first visit : [first employee account creation](https://bankingaccounts-system.vercel.app/employee-register)
- **Multiple Accounts**: Create and manage multiple bank accounts in one place
- **Transaction History**: View detailed history of all your transactions
- **Fund Transfers**: Easily transfer money between your accounts
- **Calculate interest**: Calculate interest on the accounts and apply interest.
- **Secure Banking**: Industry-standard encryption to protect your data
- **Responsive Design**: Access from any device - desktop, tablet, or mobile

## 🛠️ Technology Stack

### Frontend
- React.js
- Next.js
- TailwindCss
- Deployed on Vercel

### Backend
- Node.js
- Express.js
- MongoDB
- Deployed on Render

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- MongoDB (for local development)

### Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/mutungapeter/Banking-management-sysem.git
   cd backend
   ```

2. Set up the backend
   ```bash
   cd backend
   npm install
   # Create a .env file with your MONGO_URI,PORT(backend port) ,JWT secret,CLIENT_ORIGIN(the frontend url)
   npm run dev
   ```

3. Set up the frontend
   ```bash
   cd frontend
   npm install
   # create a .env in root dir with NEXT_PUBLIC_SERVER_URI(the backend url)
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

## 📝 Environment Variables

### Backend (.env)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=your backend port

### Frontend (.env.local)
NEXT_PUBLIC_API_URL=your backend url


## 🔒 Security

- JWT-based authentication
- Password hashing
- HTTPS enforcement in production
- Input validation and sanitization

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Vercel](https://vercel.com/)
- [Render](https://render.com/)

---

