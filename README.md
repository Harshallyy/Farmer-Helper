# 🌾 Farmer Helper

**Farmer Helper** is a full-stack web application designed to help farmers make more informed decisions about their farming activities while providing a platform to manage agricultural products and orders.

The application provides **location- and weather-based farming suggestions**, weather forecasts, alerts, and insights that can help farmers plan their activities according to changing weather conditions. It also allows farmers to manage their products and inventory and receive orders from consumers.

### 🚀 Live Application

🌐 **Frontend:** [Farmer Helper](https://farmerhelper.netlify.app/)

⚙️ **Backend:** [Farmer Helper API](https://farmer-helper-a8io.onrender.com/)

---

### 📌 Contents

- [🎯 Project Goal](#-project-goal)
- [🌱 Features](#-features)
- [🌦️ Weather Integration](#️-weather-integration)
- [📸 Screenshots](#-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Application Architecture](#️-application-architecture)
- [🔮 Future Improvements](#-future-improvements)
- [⚙️ Getting Started](#️-getting-started)
- [🔐 Environment Variables](#-environment-variables)

---

## 🎯 Project Goal

The goal of **Farmer Helper** is to combine farming assistance with a simple farmer-to-consumer platform.

```text
🌾 Farming Assistance
        +
🌦️ Weather Information
        +
🛒 Product Management
        +
📦 Orders & Inventory
        ↓
   Farmer Helper
```

The application aims to make useful farming information more accessible while making it easier for farmers to manage and sell their agricultural products.

---

## 🌱 Features

### 👨‍🌾 For Farmers

* **Weather Forecast**

  * View weather information based on location.
  * Check temperature and humidity.
  * View forecast information to plan farming activities.

* **Weather Alerts**

  * Receive information about changing weather conditions.
  * Helps farmers prepare for unfavorable weather conditions.

* **Location & Weather-Based Farming Suggestions**

  * Get suggestions based on the farmer's location and current weather conditions.
  * Suggestions can consider factors such as rainfall and temperature.
  * Helps farmers decide which crops to grow and which crops may be ready for harvesting.

* **Product Management**

  * Add agricultural products for sale.
  * Update product information and prices.
  * Manage available product quantities.

* **Inventory Management**

  * Keep track of available stock.
  * Update inventory when products are added or sold.

* **Order Management**

  * View orders received from consumers.
  * Manage and update order information.

### 🛒 For Consumers

* Browse agricultural products listed by farmers.
* View product details and prices.
* Place orders directly from farmers.
* View current and previous orders.
* Track order status.

---

## 🌦️ Weather Integration

Farmer Helper uses **WeatherAPI** to provide weather information based on the farmer's location.

The application uses weather data such as:

* 🌡️ Temperature
* 💧 Humidity
* 🌧️ Rainfall / weather conditions
* 🌤️ Forecast information
* ⚠️ Weather alerts

Weather information is used to provide farmers with relevant information and basic farming suggestions.

---

## 📸 Screenshots

### Farmer Dashboard

<img width="1918" height="957" alt="Screenshot 2026-09-14 202718" src="https://github.com/user-attachments/assets/a83cb310-92ec-4f44-8c86-529c17c0542f" />

### Weather Information

<img width="1913" height="967" alt="Screenshot 2026-09-14 202700" src="https://github.com/user-attachments/assets/ef7ed1a0-8c8e-426c-a521-7de92056dc2d" />

### Product & Inventory Management

<img width="1912" height="971" alt="Screenshot 2026-09-14 202856" src="https://github.com/user-attachments/assets/a1805b61-7662-40eb-beb5-f4b38ecfb2cb" />

### Order Management

<img width="1910" height="965" alt="Screenshot 2026-09-14 202828" src="https://github.com/user-attachments/assets/c279a59a-9b12-4472-909e-736777f6d128" />

---

## 🛠️ Tech Stack

<p align="center"><b>FRONTEND</b></p>
<p align="center">
		ReactJS, JavaScript, CSS, Bootstrap
</p>

<p align="center"><b>BACKEND</b></p>
<p align="center">
		NodeJS, ExpressJS
</p>

<p align="center"><b>Database</b></p>
<p align="center">
		MongoDB
</p>

<p align="center"><b>Deployment</b></p>
<p align="center">
		Netlify, Render
</p>

---

## 🏗️ Application Architecture

```text
                         Farmer Helper
                              │
              ┌───────────────┴───────────────┐
              │                               │
          Frontend                         Backend
           React                        Node.js/Express
              │                               │
              │                    ┌──────────┴──────────┐
              │                    │                     │
              │                 MongoDB              WeatherAPI
              │
              └──────────── API Requests ───────────────┘
```

### Application Flow

```text
User
  │
  ▼
React Frontend
  │
  ▼
Node.js + Express API
  │
  ├──────────────► MongoDB
  │
  └──────────────► WeatherAPI
```

---

## 🔮 Future Improvements

Some planned improvements include:

* **Online payments** for direct farmer-to-consumer transactions.
* **Real-time delivery tracking** for orders.
* **Improved weather alerts** for extreme weather conditions.
* **AI-based farming recommendations** using location, weather, crop and seasonal information.
* **Better analytics** for farmers to track sales and inventory.
* **Mobile application** for easier access by farmers.

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MongoDB
* Git

### 1. Clone the repository

```bash
git clone https://github.com/Harshallyy/Farmer-Helper.git

cd Farmer-Helper
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
REACT_APP_API_KEY=YOUR_WEATHER_API_KEY
```

Start the frontend:

```bash
npm start
```

### 3. Setup Backend

Open another terminal:

```bash
cd backend
npm install
```

Configure the required environment variables and start the backend:

```bash
npm start
```

The application should now be available locally.

---

## 🔐 Environment Variables

Sensitive information should be stored using environment variables rather than being hardcoded in the source code.

Example:

```env
REACT_APP_API_KEY=YOUR_WEATHER_API_KEY
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
```

Do not commit `.env` files containing real credentials to GitHub.
