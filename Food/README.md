# SnapDish - A Full-Stack AI-Powered Food Delivery Platform

<p align="center">
  <img src="https://i.imgur.com/your-logo-url.png" width="200px" alt="SnapDish Logo">
  <br>
  <i>Snap it. Eat it. Love it.</i>
</p>

---

## Abstract

The SnapDish Food Delivery Website is an online platform developed to help users easily browse restaurants, explore menus, place orders, make payments, and track deliveries in real time. The product offers key features such as personalized recommendations, live order tracking, secure payment gateways, and a comprehensive admin dashboard to manage restaurants, menus, users, and delivery operations.

While it resembles popular services like Zomato and Swiggy, it stands out by offering lower commissions for small businesses, IoT-based delivery monitoring, and advanced customization options. The application is fully responsive, using a mobile-first design to ensure smooth performance across smartphones, tablets, and desktops.

---

## Key Features

- **AI-Powered Personalization**: The platform uses AI to analyze user history and preferences, suggesting dishes, restaurants, and offers in real time.
- **Smart Search & Voice Ordering**: Voice commands and image-based search make ordering easier and faster for all users.
- **Live Order Tracking**: Users can track the status of their delivery from the restaurant to their doorstep.
- **Dynamic Pricing & Cancellation Management**: A unique advantage where canceled orders are only charged a 10% fee. The food is then resold to other nearby users at a discounted rate, reducing waste and improving affordability.
- **Fraud Detection**: AI algorithms detect suspicious activities and ensure all transactions are secure.
- **Predictive Analytics**: The system forecasts peak hours and popular dishes to help restaurants optimize resources and delivery logistics.
- **Comprehensive Admin & Vendor Dashboards**: Separate interfaces for administrators, restaurant owners, and delivery agents to manage their specific roles effectively.

---

## Technology Stack

- **Frontend**: React.js, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Planned)
- **AI & Machine Learning**: Python
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Testing**: Jest
- **Deployment**: AWS EC2 (Planned)
- **Editor**: Visual Studio Code

---

## Team & Contributions

This project was developed by a collaborative team.

| Name      | Role & Contributions                                                                                                                                                             |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **VASISHTA** | **Frontend Lead & Backend Dev**: Built the Home and Menu pages, developed the Navigation Bar and Footer, and implemented the Search Bar. On the backend, developed User Authentication and Order Management APIs. |
| **KIREETI** | **Frontend & Backend Lead**: Designed the Restaurant Listing and Item Details pages, developed the Cart and Checkout components, and implemented the Order Confirmation page. On the backend, developed Restaurant/Menu APIs and integrated Payment Processing. |
| **Tarak** | **Frontend & Backend Dev**: Built the Order Tracking and User Profile pages, ensured mobile responsiveness and accessibility. On the backend, set up Admin APIs and handled logic for discounts, refunds, and cancellations. |

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your machine.
- [Node.js](https://nodejs.org/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/kireeti-ai/SnapDish.git](https://github.com/kireeti-ai/SnapDish.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd SnapDish
    ```
3.  **Install Frontend NPM packages:**
    ```sh
    npm install
    ```
4.  **Install Backend NPM packages (if applicable):**
    ```sh
    cd backend 
    npm install
    ```
5.  **Run the development server:**
    ```sh
    # From the root directory
    npm run dev
    ```
The application will be available at `http://localhost:5173` (or another port if specified).

---

## Future Roadmap

- **Full Backend Implementation**: Complete the development of all backend APIs for orders, payments, and user management.
- **Database Integration**: Connect the backend to a MongoDB database to persist all application data.
- **Dedicated Dashboards**: Build out the full UIs for the Restaurant Owner, Delivery Agent, and Administrator roles.
- **Payment Gateway**: Integrate a payment provider like Stripe or Razorpay to handle real transactions.
- **AI Module Integration**: Connect the Python-based AI modules to the Node.js backend to enable live recommendations and analytics.

</markdown>