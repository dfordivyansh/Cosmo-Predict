🚀 CosmoPredict

AI Powered Space Weather & Asteroid Monitoring Platform

🌍 Live Website: https://cosmopredict.space

CosmoPredict is an advanced AI-powered Space Weather Monitoring and Asteroid Risk Analysis platform developed as a B.Tech Final Year Major Project. The system integrates real-time NASA and NOAA APIs with Machine Learning models to monitor solar activity, geomagnetic storms, and asteroid threats.


---

🌌 Project Overview

CosmoPredict provides:

Real-time space weather monitoring

Asteroid hazard analysis

AI-powered prediction system

Interactive dashboard and charts

Live NOAA alerts

NASA asteroid tracking

Machine Learning based forecasting

Secure production deployment on AWS EC2



---

✨ Features

🌍 Space Weather Monitoring

KP Index tracking

Solar storm monitoring

NOAA alert integration

Space weather visualization


☄️ Asteroid Monitoring

NASA NEO API integration

Near-Earth object tracking

Hazard probability analysis

Risk classification system


🤖 AI & Machine Learning

LSTM-based forecasting

TensorFlow prediction models

AI risk analysis

Historical trend analysis


📊 Dashboard & UI

Interactive charts

Responsive frontend

Real-time updates

Modern futuristic design


🔒 Security & Deployment

HTTPS SSL security

Nginx reverse proxy

AWS EC2 hosting

Production-ready setup



---

🛠️ Tech Stack

Frontend

React

Vite

TypeScript

Tailwind CSS

shadcn/ui


Backend

Django

Django REST Framework

Waitress Server

APScheduler


AI / ML

TensorFlow

Scikit-learn

Pandas

NumPy


Deployment

AWS EC2 Windows Server

Nginx

Let’s Encrypt SSL

Win-ACME



---

📂 Project Structure

Cosmo-Predict/
│
├── cosmo-frontend/      # React Frontend
├── cosmo-backend/       # Django Backend
├── Documentation/       # Project Documentation
└── README.md


---

⚙️ Installation Guide

1️⃣ Clone Repository

git clone https://github.com/dfordivyansh/Cosmo-Predict.git


---

2️⃣ Backend Setup (Django)

Navigate to Backend

cd cosmo-backend

Create Virtual Environment

python -m venv venv

Activate Environment

Windows

venv\Scripts\activate


---

Install Dependencies

pip install -r requirements.txt


---

Run Migrations

python manage.py migrate


---

Create Superuser

python manage.py createsuperuser


---

Start Django Server

python manage.py runserver

Backend URL:

http://127.0.0.1:8000


---

3️⃣ Frontend Setup (React + Vite)

Navigate to Frontend

cd cosmo-frontend


---

Install Packages

npm install


---

Start Development Server

npm run dev

Frontend URL:

http://localhost:5173


---

🧠 Machine Learning Features

CosmoPredict integrates Machine Learning models for:

Space weather prediction

Asteroid hazard analysis

Geomagnetic activity forecasting

Solar storm risk analysis


Models Used

LSTM Networks

Random Forest

TensorFlow Sequential Models



---

🌐 APIs Used

NOAA APIs

Used for:

KP Index

Solar activity

Geomagnetic storm alerts

Space weather monitoring


NASA APIs

Used for:

Asteroid tracking

Near Earth Object monitoring

Hazard detection



---

☁️ AWS Deployment

CosmoPredict is deployed on:

AWS EC2 Windows Server

Nginx Reverse Proxy

HTTPS SSL using Let’s Encrypt


Live Production URL

🌍 https://cosmopredict.space


---

🔒 SSL & Security

HTTPS enabled

SSL certificates via Let’s Encrypt

Nginx reverse proxy security

Secure API routing



---

🚀 Production Build

Frontend Build

set NODE_OPTIONS=--max-old-space-size=4096 && npm run build


---

Django Production Server

waitress-serve --host=0.0.0.0 --port=8000 config.wsgi:application


---

📸 Screenshots

Home Page

> Add screenshot here




---

Dashboard

> Add screenshot here




---

AI Prediction Panel

> Add screenshot here




---

Django Admin

> Add screenshot here




---

📊 Key Features Demonstrated

✅ Real-Time Data Processing

✅ Machine Learning Integration

✅ Space Weather Monitoring

✅ Asteroid Threat Analysis

✅ Secure AWS Deployment

✅ SSL Encryption

✅ Responsive UI

✅ Production Deployment


---

🔥 Challenges Solved

GitHub Large File Issues

Removed virtual environments

Added proper .gitignore


Static File Issues

Configured STATIC_ROOT

Used Nginx static serving


SSL Deployment Issues

Configured Let’s Encrypt with Win-ACME

Enabled HTTPS on AWS EC2


React Build Memory Error

Solved using:

set NODE_OPTIONS=--max-old-space-size=4096 && npm run build


---

🎯 Future Enhancements

PostgreSQL Database

Docker Deployment

Kubernetes Scaling

Redis Caching

WebSocket Real-time Updates

Cloudflare CDN

AI Model Optimization



---

👨‍💻 Developer

Divyansh Srivastava

B.Tech Final Year Major Project


---

📄 License

This project is developed for educational and research purposes.


---

⭐ Support

If you like this project, please give it a ⭐ on GitHub.


---

🌍 Live Project

https://cosmopredict.space
