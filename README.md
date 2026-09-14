# Farmer Helper (2026)

This webapp aims at helping farmers to make more informed decisions regarding their harvesting patterns and giving them various suggestions based on their location.
Suggestions can be based on their location, rainfall or current temperature.
We also provide weather alerts and forecast insights to help farmers plan for changing conditions.

## Frontend weather configuration

The forecast UI uses WeatherAPI on the frontend. Create or update the frontend/.env file with a valid key as follows:

REACT_APP_API_KEY=YOUR_WEATHER_API_KEY_FROM_WEATHERAPI

Do not commit a real API key into source control. If the variable is missing, blank, or invalid, the weather section will fail gracefully with a clear message instead of breaking the dashboard.

## Links

The website is hosted at <a href="https://farmerhelper.netlify.app/">Farmer Helper</a>

[Backend](https://farmer-helper-a8io.onrender.com/)

## Features

- Weather Forecast: Humidity and Temperature Prediction.
- Providing suggestions to farmer based on his location and weather conditions.
- Manage Orders and Inventories.

# Snapshots

<img width="1918" height="957" alt="Screenshot 2026-09-14 202718" src="https://github.com/user-attachments/assets/a83cb310-92ec-4f44-8c86-529c17c0542f" />

<img width="1913" height="967" alt="Screenshot 2026-09-14 202700" src="https://github.com/user-attachments/assets/ef7ed1a0-8c8e-426c-a521-7de92056dc2d" />

<img width="1912" height="971" alt="Screenshot 2026-09-14 202856" src="https://github.com/user-attachments/assets/a1805b61-7662-40eb-beb5-f4b38ecfb2cb" />

<img width="1910" height="965" alt="Screenshot 2026-09-14 202828" src="https://github.com/user-attachments/assets/c279a59a-9b12-4472-909e-736777f6d128" />

## Tech Stack

<p align="center"><b>FRONTEND</b></p>
<p align="center">
		ReactJS, CSS, Bootstrap
</p>

<p align="center"><b>BACKEND</b></p>
<p align="center">
		NodeJS, ExpressJS
</p>

<p align="center"><b>Database</b></p>
<p align="center">
		MongoDB
</p>
