
-----

# Snap-dish: A Full Stack Food Delivery Platform

Snap-dish is a comprehensive, multi-faceted food delivery application built on the MERN stack. It provides a seamless and integrated ecosystem for four key user roles: customers, restaurant administrators, delivery agents, and platform administrators. Each role has its own dedicated frontend application for a tailored user experience, all powered by a single, robust backend.

## Features

###  1. Customer App (`Food`)

  - **Browse & Discover:** Search for restaurants and explore their menus.
  - **Shopping Cart:** Add, remove, and manage items in a persistent cart.
  - **Seamless Checkout:** Place orders with an easy-to-use checkout form.
  - **Order Tracking:** View the status of current and past orders.
  - **Personalization:** Manage saved addresses and a personal wishlist.
  - **Community:** Apply to the Creator Program to partner with the platform.

###  2. Restaurant Admin Panel (`restaurant-admin`)

  - **Dashboard:** A visual overview of total revenue, orders, and sales trends.
  - **Menu Management:** Full CRUD (Create, Read, Update, Delete) functionality for menu items, including image uploads.
  - **Order Management:** View and manage incoming orders from customers.
  - **Reporting:** Access detailed reports on sales and performance.

###  3. Delivery Agent App (`DeliveryAgent`)

  - **Order Notifications:** Receive and accept new delivery assignments.
  - **Active Order Management:** View customer details and update order statuses (e.g., "Out for delivery," "Delivered").
  - **Earnings Tracker:** A dashboard to view total earnings and delivery history.
  - **Profile Management:** Update personal information.

###  4. Main Admin Panel (`admin`)

  - **Central Dashboard:** Platform-wide statistics on users, orders, and restaurants.
  - **User & Partner Management:** View and manage all users, restaurants, and delivery partners.
  - **Request Approval:** Approve or deny applications from new restaurants and creators.
  - **Order Oversight:** View and manage every order placed on the platform.
  - **Platform Settings:** Configure global settings like delivery fees and commission rates.

## Technology Stack

  - **Backend:** Node.js, Express.js
  - **Frontend:** React.js (Vite)
  - **Database:** MongoDB (with Mongoose)
  - **Authentication:** JSON Web Tokens (JWT)
  - **Image Management:** Cloudinary for cloud-based media storage
  - **API Architecture:** RESTful API

## Getting Started

### Prerequisites

  - Node.js (v18.x or higher)
  - npm (v9.x or higher)
  - MongoDB (local or Atlas connection string)

### Backend Setup (`Back`)

1.  **Navigate to the backend directory:**
    ```bash
    cd Back
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the `Back` directory and add the following, replacing the placeholder values:
    ```env
    PORT=4000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```
4.  **Start the server:**
    ```bash
    npm start
    ```
    The backend server will be running on `http://localhost:4000`.

### Frontend Setup (For each frontend app)

You need to run each of the four frontend applications in a separate terminal.

**1. Customer App (`Food`)**

```bash
cd Food
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

**2. Main Admin Panel (`admin`)**

```bash
cd admin
npm install
npm run dev
```

The app will be available at a new port (e.g., `http://localhost:5174`).

**3. Restaurant Admin Panel (`restaurant-admin`)**

```bash
cd restaurant-admin
npm install
npm run dev
```

The app will be available at a new port (e.g., `http://localhost:5175`).

**4. Delivery Agent App (`DeliveryAgent`)**

```bash
cd DeliveryAgent
npm install
npm run dev
```

The app will be available at a new port (e.g., `http://localhost:5176`).

{
  "admin": {
    "email": "admin@snapdish.com",
    "password": "Admin@123456",
    "role": "admin"
  },
  "restaurantOwner": {
    "email": "ravi4@example.com",
    "password": "agentpassword123",
    "role": "restaurant_owner"
  },
  "deliveryAgent": {
    "email": "delivery@snapdish.com",
    "password": "Delivery@123456",
    "role": "delivery_agent"
  },
  "customer": {
    "email": "customer@snap.com",
    "password": "Customer@123456",
    "role": "customer"
  }
}