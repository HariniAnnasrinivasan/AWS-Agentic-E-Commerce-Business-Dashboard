📊 E-Commerce Business Analytics Dashboard
AI-Powered Business Intelligence Platform Using AWS Bedrock Agents

This project is a complete end-to-end AI-driven Business Analytics Dashboard built for an e-commerce platform.
It provides smart insights, operational intelligence, and business monitoring using AWS Bedrock Agents, RDS (PostgreSQL), and a fully interactive UI.

It includes:

📈 Revenue Insights

📦 Product Performance Analysis

⭐ Customer Feedback Intelligence

⚙️ Operations Efficiency Analysis

🤖 AI Chat Assistants for every business domain

🔐 Secure Admin Login System

🗄️ Real database-driven visualizations

This dashboard is designed for Business Admins to observe, analyze, and optimize the performance of their e-commerce business.

🚀 Features Overview
🔐 1. Secure Admin Login System

Username + password authentication

Passwords stored as bcrypt hashes

Protected routes for all dashboards

Token-based auth (session-<id>-<timestamp>)

Auto-redirect to login if unauthenticated

📊 2. Main Business Dashboard

Includes high-level KPIs such as:

Total revenue

Daily/Monthly revenue trend

Best-selling category

Most active cities

Payment success vs failure

Order completion efficiency

All graphs are powered directly from the PostgreSQL RDS database.

💰 3. Revenue Insight Agent

AI agent connected to AWS Bedrock that can:

Analyze revenue patterns

Identify high-performing cities

Compute month-over-month growth

Detect revenue decline triggers

Answer complex revenue-related queries

Includes visualizations:

Daily revenue trend

Category-wise revenue

City-wise revenue comparison

📦 4. Product Performance Agent

Helps the admin understand product-level metrics:

Best-selling products

Revenue by product

Inventory stock levels

Category & brand performance

Low-stock alerts

AI Agent chat can answer:

“Which category performed best this month?”

“Which products need restocking?”

“Show weak-performing products.”

⭐ 5. Customer Feedback Intelligence Agent

Provides insights extracted from product_feedback table:

Sentiment analysis (Happy / Neutral / Sad)

Daily sentiment trends

Product-level feedback summaries

Most complained products

Positive vs negative feedback ratio

AI Agent chat can answer:

“Why are customers unhappy this week?”

“Which product has the most negative feedback?”

⚙️ 6. Business Operations Efficiency Agent

A powerful agent covering:

Delivery delays

Processing delays

Payment slowdowns

Cancellation issues

City-wise operational breakdown

Recommendations based on backend data

Special advanced features:

Order processing delay detection

Delivery delay grouping by cities

Panoramic delay analysis (top 3 cities per delay type)

🗄️ Database Schema (RDS PostgreSQL)

The project uses multiple relational tables including:

customers

orders

order_items

payments

deliveries

refunds

product_feedback

order_status_history

discounts

revenue_strategy_factors

past_strategy_summary

admin_users (for login)

All agents & dashboards query this database using optimized SQL.

🤖 AWS Bedrock Agent Architecture

Each domain has its own dedicated Bedrock Agent:

1️⃣ Revenue Insight Agent
2️⃣ Product Performance Agent
3️⃣ Feedback Intelligence Agent
4️⃣ Business Operations Efficiency Agent

Each agent includes:

A system prompt defining behavior

1–5 Action Groups with OpenAPI schemas

AWS Lambda functions following this response format:

{
  "messageVersion": "1.0",
  "response": {
    "actionGroup": "string",
    "apiPath": "string",
    "httpMethod": "POST",
    "httpStatusCode": 200,
    "responseBody": {
      "application/json": {
        "body": "{JSON_STRING}"
      }
    }
  }
}


This ensures consistent behavior across all agents.

🧩 UI Architecture

The UI contains:

✔ Main Dashboard
✔ Individual Agent Pages

Revenue

Product Performance

Feedback Intelligence

Business Operations Efficiency

✔ Chat Interfaces

Each page has a “Ask Personalized Questions” button to open a chat panel.
The chat interacts with the corresponding Bedrock agent via backend API.

✔ Secure Authentication Flow

/login → public

All other pages → protected

Token saved & verified for every request

🛠️ Tech Stack
Frontend

Antigravity UI Framework

React

Modern responsive components

Recharts / Chart.js style charts

JWT-like session tokens

Backend

Node.js

Express API routes

PostgreSQL (AWS RDS)

Bcrypt for password hashing

AI

AWS Bedrock

Nova Lite foundation models

Action Groups

Lambdas

Knowledge bases

🔌 How to Run the Project
1. Clone the repository
git clone <your-repo-url>
cd project-folder

2. Install dependencies
npm install

3. Set environment variables

Create .env:

DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_NAME=
REGION=
AGENT_ID=
AGENT_ALIAS_ID=

4. Run the development server
npm run dev

5. Login credentials
Username: admin
Password: Admin@123
