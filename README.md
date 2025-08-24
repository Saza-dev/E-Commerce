# E-Commerce Platform

A full-featured e-commerce application built with Next.js (frontend) and NestJS (backend), featuring robust functionality for users, admins, and products.

## Features

- `Admin Panel`
- `Users` : Manage all users
- `Categories` : Manage categories and map products to them
- `Products` : Manage products including variants
- `Cart` : Add, remove, and update products in the cart
- `Addresses` : Manage multiple shipping addresses
- `Profile` : Update and manage user profiles
- `Search Products` : Quickly find products
- `Filter Products` : Filter by category, price, or attributes
- `Categorized Products` : Browse products by category
- `Product Variants` : Handle different variants like size, color, etc.
- `Future Features` : More functionalities to be added

## Tech Stack

- `Frontend` : Next.js
- `Backend` : NestJS
- `Database` : PostgreSQL
- `ORM` : Prisma

## Getting Started

### 1. Clone the repository
 ```
 git clone https://github.com/Saza-dev/E-Commerce.git
 ```
### 2. Install dependencies for frontend and backend
```
cd frontend && npm install  
cd ../backend && npm install
```
### 3. Set up environment variables in .env files for frontend and backend.

- Backend (.env)
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES=
CORS_ORIGINS=http://localhost:3001
```

- Frontend (.env)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```
### 4. Setting up Prisma
- Install Prisma CLI (if not installed)
```
npm install prisma --save-dev
```
- Generate the Prisma client
```
npx prisma generate
```
- Apply database migrations
```
npx prisma migrate dev --name init
```
  
### 5. Run the application
```
# Frontend
npm run dev  

# Backend
npm run start:dev
```

## Database
- PostgreSQL with Prisma ORM
- Fully functional schema supporting users, products, categories, carts, and addresses

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

