# E-commerce Shop — Authentication & Product CRUD

A full-stack e-commerce product management application built as part of the **Sheryians Coding School Authentication & Product CRUD Assignment**.

The project implements a secure authentication system using **JWT access and refresh tokens**, protected **Product CRUD APIs**, request validation with **express-validator**, and a React frontend that consumes the backend APIs.

---

## 🚀 Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Short-lived access tokens
* Long-lived refresh tokens
* Refresh tokens stored as hashed values in MongoDB
* Refresh token sent using an `httpOnly` cookie
* Logout with refresh-token invalidation
* Authenticated user profile endpoint
* Password hashing using `bcryptjs`
* Duplicate email detection
* Generic invalid-login error messages

### Product Management

* Create products
* View all products
* View a single product
* Update products
* Delete products
* Protected create, update and delete routes
* Product ownership is associated with the authenticated user
* MongoDB ObjectId validation
* Mongoose schema validation

### Request Validation

All applicable API inputs are validated using `express-validator`.

Validation includes:

* Name validation
* Email format validation
* Password length validation
* Confirm password matching
* Product name validation
* Product description validation
* Price validation
* Stock validation
* Image URL validation
* MongoDB product ID validation

Validation errors are returned as field-level errors with HTTP `400`.

### Frontend

* React + TypeScript
* Vite
* Tailwind CSS
* Login and registration UI
* Product listing
* Product creation
* Product editing
* Product deletion
* Logout
* Authentication state handling
* API error handling
* Persistent access token using `localStorage`

---

## 📚 Documentation

| Documentation | Description |
|---|---|
| [Frontend README](./client/README.md) | React frontend setup, architecture, API integration, and UI |
| [Backend README](./server/README.md) | Express API, authentication, validation, database models, and endpoints |

### Project Structure

```text
.
├── README.md
├── client/
│   ├── README.md
│   └── ...
└── server/
    ├── README.md
    └── ...
```

For detailed documentation:

* **Frontend:** [client/README.md](./client/README.md)
* **Backend:** [server/README.md](./server/README.md)

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (`jsonwebtoken`)
* bcrypt (`bcryptjs`)
* express-validator
* cookie-parser
* CORS
* dotenv

---

## 📁 Project Structure

```text
.
├── client
│   ├── src
│   │   ├── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
    │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
│
└── server
    ├── src
    │   ├── controllers
    │   │   ├── auth.controller.js
    │   │   └── product.controller.js
    │   │
    │   ├── middleware
    │   │   ├── authenticate.js
    │   │   └── validate.js
    │   │
    │   ├── models
    │   │   ├── Product.js
    │   │   └── User.js
    │   │
    │   ├── routes
    │   │   ├── auth.routes.js
    │   │   └── product.routes.js
    │   │
    │   └── utils
    │       └── tokens.js
    │
    ├── api
    │   └── index.js
    │
    ├── server.js
    ├── package.json
    ├── vercel.json
    └── README.md
```

---

# ⚙️ Getting Started

## 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd <project-folder>
```

---

## 2. Install backend dependencies

```bash
cd server
npm install
```

---

## 3. Configure backend environment variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

CLIENT_URL=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

NODE_ENV=development
```

### Environment variables

| Variable               | Description                           |
| ---------------------- | ------------------------------------- |
| `PORT`                 | Port on which the Express server runs |
| `MONGODB_URI`          | MongoDB connection string             |
| `CLIENT_URL`           | Frontend URL allowed by CORS          |
| `ACCESS_TOKEN_SECRET`  | Secret used to sign access tokens     |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh tokens    |
| `NODE_ENV`             | Application environment               |

**Never commit your `.env` file or JWT secrets to GitHub.**

---

## 4. Start the backend

From the `server` directory:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory if you want to configure the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

If `VITE_API_URL` is not provided, the frontend automatically uses:

```text
http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔐 Authentication Flow

The application uses two JWT tokens:

### Access Token

* Short-lived
* Expires after **15 minutes**
* Signed using `ACCESS_TOKEN_SECRET`
* Returned in the login response
* Sent by the frontend using the `Authorization` header

Example:

```http
Authorization: Bearer <access_token>
```

### Refresh Token

* Long-lived
* Expires after **7 days**
* Signed using `REFRESH_TOKEN_SECRET`
* Stored in an `httpOnly` cookie
* Hashed before being stored in the database
* Can be invalidated during logout

### Login Flow

```text
User
  │
  │ Login
  ▼
POST /api/auth/login
  │
  ├── Verify email
  ├── Compare password with bcrypt
  │
  ├── Generate Access Token
  └── Generate Refresh Token
          │
          ├── Access Token → JSON response
          └── Refresh Token → httpOnly cookie
```

### Accessing Protected Routes

The frontend sends the access token in the `Authorization` header.

```text
React Frontend
      │
      │ Bearer Access Token
      ▼
authenticate middleware
      │
      ├── Verify JWT
      │
      └── Attach user to req.user
              │
              ▼
          Controller
```

---

# 📡 API Documentation

Base URL:

```text
/api
```

## Authentication APIs

### Register

```http
POST /api/auth/register
```

**Access:** Public

#### Request body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Success response

```json
{
  "message": "Account created. Please log in.",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "..."
  }
}
```

The password is never returned.

---

### Login

```http
POST /api/auth/login
```

**Access:** Public

#### Request body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Success response

```json
{
  "message": "Logged in successfully.",
  "accessToken": "<access_token>",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "..."
  }
}
```

The refresh token is sent as an `httpOnly` cookie.

---

### Refresh Access Token

```http
POST /api/auth/refresh-token
```

**Access:** Public with valid refresh-token cookie

Returns a new access token when the refresh token is valid.

```json
{
  "accessToken": "<new_access_token>"
}
```

---

### Logout

```http
POST /api/auth/logout
```

**Access:** Authenticated

The stored refresh-token hash is invalidated and the refresh-token cookie is cleared.

#### Response

```json
{
  "message": "Logged out successfully."
}
```

---

### Get Current User

```http
GET /api/auth/me
```

**Access:** Authenticated

#### Headers

```http
Authorization: Bearer <access_token>
```

#### Response

```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "..."
  }
}
```

---

# 🛍️ Product APIs

## Create Product

```http
POST /api/products
```

**Access:** Authenticated

#### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Request body

```json
{
  "name": "Wireless Headphones",
  "description": "Noise cancelling wireless headphones",
  "price": 99.99,
  "stock": 25,
  "imageUrl": "https://example.com/headphones.jpg"
}
```

---

## Get All Products

```http
GET /api/products
```

**Access:** Public

#### Response

```json
{
  "products": []
}
```

Products are returned with their associated creator's basic name and email information.

---

## Get Single Product

```http
GET /api/products/:id
```

**Access:** Public

Example:

```http
GET /api/products/68xxxxxxxxxxxxxxxxxxxxxx
```

The product ID is validated before querying MongoDB.

---

## Update Product

```http
PUT /api/products/:id
```

**Access:** Authenticated

#### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Request body

```json
{
  "name": "Updated Headphones",
  "description": "Updated product description",
  "price": 119.99,
  "stock": 20,
  "imageUrl": "https://example.com/updated.jpg"
}
```

---

## Delete Product

```http
DELETE /api/products/:id
```

**Access:** Authenticated

#### Headers

```http
Authorization: Bearer <access_token>
```

#### Response

```json
{
  "message": "Product deleted."
}
```

---

# ✅ Validation

The backend uses `express-validator` before controller logic executes.

### Authentication validation

* Name must contain at least 2 characters
* Email must be valid
* Password must contain at least 8 characters
* Confirm password must match the password

### Product validation

* Product name must contain at least 2 characters
* Description must contain at least 5 characters
* Price must be a non-negative number
* Stock must be a non-negative whole number
* Image URL must be a valid URL when provided

### Product ID validation

Product IDs are checked using MongoDB ObjectId validation before database queries.

### Validation response

Invalid requests return HTTP `400` with field-level errors.

Example:

```json
{
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Enter a valid email."
    }
  ]
}
```

---

# 🗄️ Database Models

## User

```text
User
├── name
├── email
├── password
├── refreshTokenHash
├── createdAt
└── updatedAt
```

Passwords are hashed using `bcryptjs`.

Refresh tokens are also hashed before being stored in MongoDB.

---

## Product

```text
Product
├── name
├── description
├── price
├── stock
├── imageUrl
├── createdBy
├── createdAt
└── updatedAt
```

`createdBy` references the authenticated `User`.

---

# 🔒 Security

The project implements several security measures required by the assignment:

* Passwords are never stored as plain text
* Passwords are hashed using bcrypt
* Access tokens use a dedicated JWT secret
* Refresh tokens use a separate JWT secret
* Access tokens expire after 15 minutes
* Refresh tokens expire after 7 days
* Refresh tokens are stored as hashes
* Refresh tokens are stored in `httpOnly` cookies
* Protected routes require a valid Bearer access token
* Invalid credentials return a generic authentication error
* JWT secrets are loaded from environment variables
* Request validation happens before controller logic
* CORS is configured with credentials support

---

# 🔄 Frontend Data Flow

The React frontend communicates with the Express API through a centralized request helper in:

```text
client/src/api.ts
```

The request helper:

1. Builds the API URL
2. Sends JSON requests
3. Includes cookies using `credentials: "include"`
4. Adds the access token as a Bearer token when available
5. Parses API responses
6. Converts validation errors into readable frontend messages

The main application logic is handled in:

```text
client/src/App.tsx
```

The frontend manages:

* Authentication state
* Product state
* Login/register forms
* Product creation
* Product editing
* Product deletion
* Logout
* API error messages

---

# 🧪 Running the Complete Application

Start the backend:

```bash
cd server
npm install
npm run dev
```

Then start the frontend in another terminal:

```bash
cd client
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 📦 Production Build

Build the frontend:

```bash
cd client
npm run build
```

The production frontend build will be generated in:

```text
client/dist
```

Start the backend in production mode:

```bash
cd server
npm start
```

---

# 🚀 Deployment

The project can be deployed to Vercel as two separate projects from the same GitHub repository.

### Frontend — Vercel

Create a Vercel project using the repository:

- **Root Directory:** `client`
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Add:

```env
VITE_API_URL=https://your-backend.vercel.app/api
```

### Backend — Vercel

Create another Vercel project using the same repository:

* **Root Directory:** `server`

The backend uses:

```text
server/
├── api/
│   └── index.js
├── src/
├── server.js
└── vercel.json
```

`server.js` supports both local development and Vercel deployment.

Add these Vercel environment variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
CLIENT_URL=https://your-frontend.vercel.app
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

### Database

For deployment, use MongoDB Atlas and set the Atlas connection string as `MONGODB_URI`.

### Local vs Production

| Environment | Backend                    | Database      |
| ----------- | -------------------------- | ------------- |
| Local       | Express + `app.listen()`   | Local MongoDB |
| Vercel      | Vercel serverless function | MongoDB Atlas |

When running in production, the refresh-token cookie is configured as `secure`.

---

# 📋 Assignment Requirements

This project covers the major requirements of the Sheryians Coding School assignment:

| Requirement                   | Implementation |
| ----------------------------- | -------------- |
| Register API                  | ✅              |
| Login API                     | ✅              |
| Access JWT                    | ✅              |
| Refresh JWT                   | ✅              |
| Logout                        | ✅              |
| Current user API              | ✅              |
| Password hashing              | ✅              |
| Refresh token persistence     | ✅              |
| Protected routes              | ✅              |
| Product Create                | ✅              |
| Product Read                  | ✅              |
| Product Update                | ✅              |
| Product Delete                | ✅              |
| express-validator             | ✅              |
| Field-level validation errors | ✅              |
| React frontend                | ✅              |
| Login/Register UI             | ✅              |
| Product listing               | ✅              |
| Add/Edit/Delete UI            | ✅              |
| README documentation          | ✅              |

---

# 📌 API Summary

| Method   | Endpoint                  | Access        |
| -------- | ------------------------- | ------------- |
| `POST`   | `/api/auth/register`      | Public        |
| `POST`   | `/api/auth/login`         | Public        |
| `POST`   | `/api/auth/refresh-token` | Refresh Token |
| `POST`   | `/api/auth/logout`        | Authenticated |
| `GET`    | `/api/auth/me`            | Authenticated |
| `POST`   | `/api/products`           | Authenticated |
| `GET`    | `/api/products`           | Public        |
| `GET`    | `/api/products/:id`       | Public        |
| `PUT`    | `/api/products/:id`       | Authenticated |
| `DELETE` | `/api/products/:id`       | Authenticated |

---

# 🔗 Links

**GitHub Repository:**
`<ADD_GITHUB_REPOSITORY_LINK>`

**Live Project:**
`<ADD_LIVE_PROJECT_LINK>`

**API:**
`<ADD_DEPLOYED_API_LINK>`

---

# 👨‍💻 Author

**Bismay**

Built as part of the **Sheryians Coding School** assignment.

---
