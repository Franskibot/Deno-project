# Deno Project

## Overview

This project is a Deno-based application that provides user registration and login functionality with JWT authentication. It uses SQLite for data storage and bcrypt for password hashing.

## Features

- User registration with hashed passwords
- User login with JWT authentication
- Protected routes accessible only to authenticated users
- Mock data generation for testing

## Technologies Used

- Deno
- SQLite
- bcrypt
- JWT
- Hono
- Zod

## Getting Started

### Prerequisites

- Deno installed on your machine

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/deno-project.git
   cd deno-project
   ```

2. Create a `.env` file in the root directory and add your JWT secret:
   ```
   JWT_SECRET=your_secret_key_here
   ```

3. Install the dependencies:
   ```bash
   deno task install
   ```

## Running the Application

1. Start the development server:
   ```bash
   deno task start
   ```

2. The application will be running at http://localhost:8000.

## Running Tests

1. Run the test suite:
   ```bash
   deno task test
   ```

## Usage

### API Endpoints

#### Register
- **URL:** `/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully!"
  }
  ```

#### Login
- **URL:** `/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "jwt": "your_jwt_token_here"
  }
  ```

#### Get User Details
- **URL:** `/me`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer your_jwt_token_here`
- **Response:**
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```

## Project Structure

```
.
├── auth
│   ├── jwt.ts
│   └── pwd.ts
├── mock
│   ├── database
│   │   ├── animal.db.ts
│   │   ├── personal-details.db.ts
│   │   └── mod.ts
│   ├── factory.ts
│   ├── generateMockDatabase.ts
│   ├── animal.schema.ts
│   └── personal-details.schema.ts
├── types
│   ├── common.ts
│   └── inferred.ts
├── .env
├── api.ts
├── deno.json
├── deno.lock
├── generateToken.ts
├── mod.ts
└── server.ts
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Deno
- SQLite
- bcrypt
- JWT
- Hono
- Zod