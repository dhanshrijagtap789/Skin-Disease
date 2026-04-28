Skin Disease Detection & Product Recommendation System
This is my full-stack project built using the MERN Stack and AI. The main goal of this app is to help users identify skin issues and get the right product suggestions and care routines instantly.

The coolest part about this project is that it is lightweight. I didn't use any heavy Python libraries or local Machine Learning models. Instead, I used a direct AI API integration to handle the detection.

* How it Works
I’ve designed the flow to be very user-friendly:

User Authentication: Users can sign up and log in. During profile setup, they can save their skin type (Oily, Dry, Sensitive, etc.).

Admin Access: There is a separate login for the Admin to manage the product database.

Disease Detection: Once logged in, a user can upload a photo of their skin concern. The system sends this to the AI API, which identifies the disease and provides detailed information about it.

Smart Recommendations: Based on the disease found and the user's specific skin type, the system pulls the best-matched products and a daily skincare routine from my MongoDB database.

History Tracking: All scans and results are saved in the "History" section so users can track their progress over time.

* Tech Stack
Frontend: React.js (using Vite for super-fast performance).

Backend: Node.js & Express.js.

Database: MongoDB (to store users, products, and history).

AI Engine: Integrated AI API (for real-time analysis).

* Key Features
No Python Needed: Everything is handled within the JavaScript ecosystem using API calls.

Personalized Results: Recommendations aren't generic; they change based on whether you have dry, oily, or sensitive skin.

Fast & Modern UI: Built with Vite for a smooth, lag-free experience.

Secure Admin Portal: Only admins can update the product catalog and care tips.

* Project Structure
frontend/ - React + Vite code for the UI.

backend/ - Node/Express API routes and Controller logic.

models/ - MongoDB schemas for Users, Products, and History.

* Setup Instructions
Clone the repository.

Go to the backend folder, run npm install, and start the server with npm start.

Go to the frontend folder, run npm install, and start the app with npm run dev.

Make sure to add your API Key and MongoDB URI in the .env file.
