# Node.js Enterprise Backend

A robust Node.js backend application built with Express, TypeScript, and a suite of enterprise-grade integrations.

## Features

-   **Core**: Node.js, Express, TypeScript
-   **Database**:
    -   MySQL (TypeORM)
    -   MongoDB (Mongoose)
    -   Redis (ioredis)
-   **Logging**: Winston Logger with AOP (Aspect Oriented Programming) decorators
-   **AWS**: SQS Integration
-   **Communication**: Email (Nodemailer), SMS & WhatsApp (Twilio)
-   **Security**: Helmet, CORS, JWT Authentication
-   **Code Quality**: ESLint, Prettier

## Prerequisites

-   Node.js (v18+ recommended)
-   npm
-   MySQL Server
-   MongoDB Server
-   Redis Server

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    *(Note: If `.env.example` doesn't exist, create a `.env` file based on the keys below)*

2.  Update `.env` with your credentials:

    ```env
    PORT=3000
    NODE_ENV=development

    # Database
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=root
    DB_PASSWORD=password
    DB_NAME=enterprise_db

    # MongoDB
    MONGO_URI=mongodb://localhost:27017/enterprise_db

    # Redis
    REDIS_HOST=localhost
    REDIS_PORT=6379

    # JWT
    JWT_SECRET=supersecretkey

    # AWS
    AWS_REGION=us-east-1
    AWS_ACCESS_KEY_ID=your_key
    AWS_SECRET_ACCESS_KEY=your_secret
    SQS_QUEUE_URL=your_queue_url

    # Communication
    EMAIL_SERVICE=gmail
    EMAIL_USER=user@gmail.com
    EMAIL_PASS=password
    TWILIO_ACCOUNT_SID=your_sid
    TWILIO_AUTH_TOKEN=your_token
    TWILIO_PHONE_NUMBER=your_number
    WHATSAPP_PHONE_NUMBER=whatsapp:+14155238886
    ```

## Running the Application

### Development
Runs the application with `nodemon` for hot-reloading.
```bash
npm run dev
```

### Production
Builds the TypeScript code to JavaScript and runs the compiled version.
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── config/           # Configuration & DB connections
├── controllers/      # Request handlers
├── integrations/     # External services (AWS, Email, etc.)
├── middlewares/      # Express middlewares
├── models/           # Database models
├── services/         # Business logic
├── utils/            # Utilities (Logger, AOP)
├── app.ts            # App setup
└── server.ts         # Entry point
```

## API Endpoints

-   `GET /health`: Health check endpoint (logs execution via AOP)
