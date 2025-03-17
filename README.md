# Szucci Bags - E-commerce Platform 👜

## Overview
Szucci Bags is a full-stack e-commerce platform designed for seamless online shopping. The platform provides role-based access for Admin and Users, featuring secure authentication, product browsing, a shopping cart, and order management. Users can track their orders and manage profiles, while Admins can oversee products, orders, coupons, and users. The platform also includes an analytics dashboard for tracking sales and user engagement.

## 🔥 Features
- **Secure Authentication:** JWT-based authentication for users and admin.
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
(Include relevant screenshots of the UI)

## 📌 Future Enhancements
- Implement advanced search and filtering options.
- Integrate AI-based product recommendations.
- Add user reviews and ratings.

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📜 License
This project is licensed under the MIT License.

## 📞 Contact
For any queries or collaborations, feel free to reach out:
- **Email:** [susmitha0313@gmail.com](mailto:susmitha0313@gmail.com)
- **LinkedIn:** [Susmitha S](https://www.linkedin.com/in/susmitha-s0313)
- **GitHub:** [Susmitha0313](https://github.com/Susmitha0313)

---
**Star ⭐ the repository if you found this helpful!**
