
# 🚗 Mechanic Shop Management System

## 📋 Overview
The **Mechanic Shop Management System** is a web-based platform designed to streamline operations within a mechanic shop. It enables an **Admin** to manage staff, track repairs, handle item requests, and facilitate secure, role-based communication among different shop roles.

---

## ✨ Features

### 🔹 Admin Panel
- Secure login via **Firebase Authentication**
- Ability to create and manage staff accounts
- Overview of shop activities
- Manage repair requests and notifications
- Real-time messaging system
- Option to send messages to **All Staffs** at once

### 🔹 Staff Management
- Staff login using **Staff ID** and **password**
- Role-based access:
  - **Secretary**
  - **Repairer**
  - **Store Keeper**
- Ability to update personal details (name, email, phone, etc.)
- Password change & reset functionality

### 🔹 Inventory & Repairs
- Repairers can request tools/items from the Store Keeper
- Store Keeper receives **real-time notifications** for item requests
- Repair tracking system with estimated duration
- Inventory list with item add/edit features

### 🔹 Messaging System
- **All roles** can send messages to **other roles and the Admin**
- **Self-messaging is restricted**
- Admin can message individual staff or use **"All Staffs"** option
- Real-time **notification badge** for unread messages
- Modal pop-up to view messages, with `mark as read` functionality

### 🔹 Authentication & Security
- Firebase Authentication for all users
- Role-based access control (**RBAC**)
- Secure Firestore data access rules
- Password reset using Staff ID and verified contact details

---

## 🛠 Technology Stack

### 💻 Frontend
- **HTML, CSS, JavaScript** for UI
- **React (with Framer Motion)** for component rendering and animations
- **Firebase Authentication** for login management
- **Toastify** for feedback messages
- **LocalStorage/SessionStorage** for session handling

### 🔧 Backend (Work In Progress)
- **Firebase Firestore** for real-time database
- **Cloud Firestore Rules** for data protection
- (Planned) **Node.js + Express** for custom APIs

---

## 🚀 Roadmap

✅ Frontend UI  
✅ Firebase Authentication  
✅ Real-time Messaging & Notification System  
✅ Role-based Message Filtering  
✅ Firestore Integration for Store & Messaging  
🔧 Backend API (Coming Soon)  
📱 Mobile Optimization (Planned)

---

## 🤝 Contribution

Want to improve this project?

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes
4. Push and open a pull request

---

## 📝 License

This project is licensed under the **MIT License**.

---
 
