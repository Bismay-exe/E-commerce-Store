# E-commerce Shop — Backend API

The backend REST API for the **Sheryians Coding School Authentication & Product CRUD Assignment**.

The server is built with **Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, and express-validator**.

It provides authentication APIs, JWT access/refresh token handling, and complete Product CRUD APIs.

---

# 🛠️ Tech Stack

* **Node.js**
* **Express 5**
* **MongoDB**
* **Mongoose**
* **JSON Web Tokens**
* **bcryptjs**
* **express-validator**
* **cookie-parser**
* **CORS**
* **dotenv**
* **Nodemon**

---

# ✨ Features

## Authentication

* User registration
* User login
* Password hashing with bcrypt
* Duplicate email detection
* JWT access tokens
* JWT refresh tokens
* Refresh-token persistence
* Refresh-token hashing
* httpOnly refresh-token cookie
* Access-token authentication middleware
* Refresh-token validation
* Logout and refresh-token invalidation
* Current-user endpoint

## Products

* Create products
* List products
* Get a single product
* Update products
* Delete products
* Authenticated write operations
* MongoDB ObjectId validation
* Product creator reference

## Validation

* `express-validator`
* Field-level validation errors
* Authentication input validation
* Product input validation
* MongoDB ID validation

---

# 📁 Project Structure

```text
server/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── product.controller.js
│   │
│   ├── middleware/
│   │   ├── authenticate.js
│   │   └── validate.js
│   │
│   ├── models/
│   │   ├── Product.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── product.routes.js
│   │
│   └── utils/
│       └── tokens.js
│
├── package.json
├── server.js
└── README.md
```

---

# 📌 Architecture

The backend follows a simple layered Express architecture:

```text
HTTP Request
     │
     ▼
   Routes
     │
     ├──────────────┐
     │              │
     ▼              ▼
Validation     Authentication
     │              │
     └──────┬───────┘
            ▼
       Controller
            │
            ▼
          Model
            │
            ▼
         MongoDB
            │
            ▼
       JSON Response
```

---

# ⚙️ Installation

From the `server` directory:

```bash
npm install
```

---

# 🔧 Environment Variables

Create:

```text
server/.env
```

Example:

```env
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/e-commerce-store

CLIENT_URL=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

NODE_ENV=development
```

### Variables

| Variable               | Purpose                          |
| ---------------------- | -------------------------------- |
| `PORT`                 | Express server port              |
| `MONGODB_URI`          | MongoDB connection string        |
| `CLIENT_URL`           | Frontend origin used by CORS     |
| `ACCESS_TOKEN_SECRET`  | Secret used to sign access JWTs  |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh JWTs |
| `NODE_ENV`             | Application environment          |

Use strong, unique values for both JWT secrets.

Do not commit `.env` to Git.

---

# ▶️ Running the Server

### Development

```bash
npm run dev
```

This runs the server using Nodemon.

### Production

```bash
npm start
```

The server starts using Node:

```bash
node server.js
```

---

# 🌐 Server URL

By default:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api
```

Health endpoint:

```http
GET /api/health
```

Response:

```json
{
  "message": "API is running"
}
```

---

# 🔐 Authentication

The API uses two JWT tokens.

## Access Token

The access token:

* Is signed using `ACCESS_TOKEN_SECRET`
* Expires after **15 minutes**
* Contains the user's ID and email
* Is returned in the login response
* Is used to access protected routes

Example:

```http
Authorization: Bearer <access_token>
```

---

## Refresh Token

The refresh token:

* Is signed using `REFRESH_TOKEN_SECRET`
* Expires after **7 days**
* Is sent through an `httpOnly` cookie
* Is not returned as normal JSON
* Has its bcrypt hash stored in the user's database record

The cookie is configured with:

```text
httpOnly: true
secure: production only
sameSite: lax
maxAge: 7 days
```

---

# 🔄 Authentication Flow

## Registration

```text
POST /api/auth/register
        │
        ▼
Validate input
        │
        ▼
Check duplicate email
        │
        ▼
Hash password with bcrypt
        │
        ▼
Create User
        │
        ▼
Return safe user information
```

Registration does **not** issue JWT tokens.

---

## Login

```text
POST /api/auth/login
        │
        ▼
Validate email/password
        │
        ▼
Find user
        │
        ▼
bcrypt.compare()
        │
        ▼
Generate access token
        │
        ├──────────────► JSON response
        │
        ▼
Generate refresh token
        │
        ▼
Hash refresh token
        │
        ▼
Store hash in User
        │
        ▼
Set httpOnly cookie
```

---

## Refresh

```text
POST /api/auth/refresh-token
        │
        ▼
Read refreshToken cookie
        │
        ▼
Verify JWT
        │
        ▼
Find user
        │
        ▼
Compare token with stored hash
        │
        ▼
Generate new access token
```

If the refresh token is missing, invalid, expired, or no longer matches the stored hash, the request is rejected.

---

## Logout

```text
POST /api/auth/logout
        │
        ▼
Authenticate access token
        │
        ▼
Find current user
        │
        ▼
Set refreshTokenHash = null
        │
        ▼
Clear refreshToken cookie
```

This prevents the previously stored refresh token from being used again.

---

# 🛡️ Authentication Middleware

File:

```text
src/middleware/authenticate.js
```

The middleware:

1. Reads the `Authorization` header.
2. Extracts the Bearer token.
3. Verifies the JWT using `ACCESS_TOKEN_SECRET`.
4. Stores the decoded payload in `req.user`.
5. Allows the request to continue.

Example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

If the token is missing:

```http
401 Unauthorized
```

If the token is invalid or expired:

```http
401 Unauthorized
```

---

# ✅ Validation Middleware

File:

```text
src/middleware/validate.js
```

The middleware uses:

```js
validationResult(req)
```

to collect validation errors generated by `express-validator`.

Invalid requests return:

```http
400 Bad Request
```

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

# 👤 User Model

File:

```text
src/models/User.js
```

The User model contains:

```text
User
├── name
├── email
├── password
├── refreshTokenHash
├── createdAt
└── updatedAt
```

### Password

Passwords are stored as bcrypt hashes.

The application never returns the password in the API response.

### Refresh Token

Only the hashed refresh token is stored:

```text
refreshTokenHash
```

The raw refresh token is kept inside the httpOnly cookie.

---

# 🛍️ Product Model

File:

```text
src/models/Product.js
```

The Product model contains:

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

`createdBy` references the `User` model.

---

# 📡 API Reference

Base URL:

```text
/api
```

## Authentication

| Method | Endpoint              | Access         |
| ------ | --------------------- | -------------- |
| `POST` | `/auth/register`      | Public         |
| `POST` | `/auth/login`         | Public         |
| `POST` | `/auth/refresh-token` | Refresh Cookie |
| `POST` | `/auth/logout`        | Authenticated  |
| `GET`  | `/auth/me`            | Authenticated  |

---

## Products

| Method   | Endpoint        | Access        |
| -------- | --------------- | ------------- |
| `GET`    | `/products`     | Public        |
| `GET`    | `/products/:id` | Public        |
| `POST`   | `/products`     | Authenticated |
| `PUT`    | `/products/:id` | Authenticated |
| `DELETE` | `/products/:id` | Authenticated |

---

# 👤 Authentication API

## Register

```http
POST /api/auth/register
```

### Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Validation

* Name: minimum 2 characters
* Email: valid email format
* Password: minimum 8 characters
* Confirm password must match password

### Success

```http
201 Created
```

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

No token is returned during registration.

---

# Login

```http
POST /api/auth/login
```

### Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Success

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

The refresh token is set as an httpOnly cookie.

---

# Refresh Token

```http
POST /api/auth/refresh-token
```

The refresh token is read from the `refreshToken` cookie.

### Success

```json
{
  "accessToken": "<new_access_token>"
}
```

---

# Logout

```http
POST /api/auth/logout
```

Requires:

```http
Authorization: Bearer <access_token>
```

The stored refresh-token hash is removed and the refresh cookie is cleared.

---

# Current User

```http
GET /api/auth/me
```

Requires:

```http
Authorization: Bearer <access_token>
```

Returns the currently authenticated user's profile.

---

# 🛒 Product API

## Create Product

```http
POST /api/products
```

Requires authentication.

### Body

```json
{
  "name": "Wireless Keyboard",
  "description": "Compact mechanical keyboard",
  "price": 79.99,
  "stock": 12,
  "imageUrl": "https://example.com/keyboard.jpg"
}
```

### Validation

* Name: minimum 2 characters
* Description: minimum 5 characters
* Price: non-negative number
* Stock: non-negative integer
* Image URL: valid URL when provided

---

# List Products

```http
GET /api/products
```

Public endpoint.

Products are returned sorted by newest creation date first.

The product's creator is populated with:

```text
name
email
```

---

# Get Product

```http
GET /api/products/:id
```

The `:id` parameter must be a valid MongoDB ObjectId.

Returns:

```http
404 Not Found
```

when the product does not exist.

---

# Update Product

```http
PUT /api/products/:id
```

Requires authentication.

The product ID is validated before querying MongoDB.

The update uses Mongoose validation:

```js
{
  new: true,
  runValidators: true
}
```

---

# Delete Product

```http
DELETE /api/products/:id
```

Requires authentication.

The product ID is validated before deletion.

Returns:

```json
{
  "message": "Product deleted."
}
```

---

# 🔒 Security Implementation

The backend implements the following security measures:

* Password hashing using bcrypt
* 12 bcrypt salt rounds for user passwords
* Separate access and refresh JWT secrets
* Short-lived access tokens
* Long-lived refresh tokens
* Refresh tokens stored as hashes
* httpOnly refresh-token cookie
* `secure` cookie configuration in production
* Bearer-token authentication middleware
* Generic invalid-login error
* Request validation before controller execution
* MongoDB ObjectId validation
* CORS with credentials support
* Secrets loaded from environment variables

---

# 🔗 Frontend Integration

The frontend is located in:

```text
../client
```

The frontend communicates with this server using:

```text
http://localhost:5000/api
```

or the production API URL configured through:

```env
VITE_API_URL=...
```

The frontend sends the access token through:

```http
Authorization: Bearer <access_token>
```

and sends cookies using:

```text
credentials: include
```

---

# 🧪 API Health Check

You can verify that the backend is running using:

```http
GET /api/health
```

Expected response:

```json
{
  "message": "API is running"
}
```

---

# ▶️ Development Workflow

Start MongoDB first.

Then:

```bash
npm install
npm run dev
```

The backend will connect to MongoDB and start the Express server.

Expected server URL:

```text
http://localhost:5000
```

---

# 📦 Production

Run:

```bash
npm start
```

Before production deployment, make sure these environment variables are configured:

```env
MONGODB_URI=...
CLIENT_URL=...
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
NODE_ENV=production
```

---

# 📚 Related Documentation

Frontend documentation:

```text
../client/README.md
```

Complete project documentation:

```text
../README.md
```

---

## 👨‍💻 Author

**Bismay**

Built for the **Sheryians Coding School Authentication & Product CRUD Assignment**.
