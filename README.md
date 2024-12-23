# Deno Project

## Overview

This project is a Deno-based application that provides user registration and login functionality with JWT authentication. It uses SQLite for data storage and bcrypt for password hashing.

## Features

- User registration with hashed passwords
- User login with JWT authentication
- Protected routes accessible only to authenticated users
- Mock data generation for testing

## Technologies Used

- Deno (https://deno.land/)
- SQLite (https://deno.land/x/sqlite)
- bcrypt (https://deno.land/x/bcrypt)
- JWT (https://deno.land/x/djwt)
- Hono (https://hono.dev/)
- Zod (https://zod.dev/)

## Getting Started

### Prerequisites

- Deno (https://deno.land/#installation) installed on your machine

### Installation

1. Clone the repository:  
git clone https://github.com/your-username/deno-project.git  
cd deno-project  

2. Create a `.env` file in the root directory and add your JWT secret:  
JWT_SECRET=your_secret_key_here  

3. Install the dependencies:  
deno task install  

### Running the Application

1. Start the development server:  
deno task start  

2. The application will be running at http://localhost:8000.

### Running Tests

Run the test suite:  
deno task test  

## Usage

- Register a new user: Send a POST request to `/register` with the required fields.  
- Login with an existing user: Send a POST request to `/login` with the required fields.  
- Access protected routes: Include the JWT token in the `Authorization` header.  

## Environment Variables

- JWT_SECRET: Secret key for signing JWT tokens.

## License

This project is licensed under the MIT License.