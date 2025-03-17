# Szucci Bags - E-commerce Platform 👜

## Overview
Szucci Bags is a full-stack e-commerce platform designed for seamless online shopping. The platform provides role-based access for Admin and Users, featuring secure authentication, product browsing, a shopping cart, and order management. Users can track their orders and manage profiles, while Admins can oversee products, orders, coupons, and users. The platform also includes an analytics dashboard for tracking sales and user engagement.

## 🔥 Features
- **Secure Authentication:** Session authentication for users and admin.
- **Role-Based Access:** Different access levels for Admin and Users.
- **Product Management:** Browse, search, and filter products.
- **Shopping Cart & Checkout:** Add products to cart and complete purchases securely.
- **Order Management:** Users can track orders; Admins can manage orders.
- **Payment Gateway Integration:** Secure transactions via Razorpay.
- **File Uploads:** Supports image and document uploads using Multer & Cloudinary.
- **Admin Dashboard:** Track sales, manage users, and monitor performance.

## 🛠 Tech Stack
- **Frontend:** HTML, CSS, JavaScript, EJS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS, Bootstrap
- **Authentication:** JWT (JSON Web Token)
- **Deployment:** AWS EC2, Nginx (Reverse Proxy)

## 🚀 Installation & Setup
### Prerequisites
- Node.js installed
- MongoDB database (local or cloud)

### Steps to Run Locally
1. **Clone the Repository**
   ```sh
   git clone https://github.com/Susmitha0313/szucci-bags.git
   cd szucci-bags
   ```
2. **Install Dependencies**
   ```sh
   npm install
   ```
3. **Set Up Environment Variables**
   Create a `.env` file and add the following:
   ```env
   PORT = 3000
   MONGO_URI = your_mongo_url
   SESSION_KEY=your_session_key
   NODEMAILER_EMAIL=your_email
   NODEMAILER_PASSWORD=your_email_password
   
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_SECRET=your_razorpay_secret
   ```
   **Note:** Replace the values with your actual credentials. Never share your real credentials in a public repository.
4. **Run the Application**
   ```sh
   npm start
   ```
   The app will be available at `http://localhost:3000`

## 📸 Screenshots
User Interface
<img src="https://github.com/user-attachments/assets/b4555eef-a29f-401c-8fe5-2d4404f7e110" width="400" />

Admin Interface
<img src="https://github.com/user-attachments/assets/5aa34eb7-1e1e-4400-8fb7-9dcfe0d88540" width="400"  />




