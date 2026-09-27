# E-commerce Shop — Frontend

The frontend application for the **Sheryians Coding School Authentication & Product CRUD Assignment**.

This is a React + TypeScript application built with Vite. It communicates with the Express backend through REST APIs and provides the user interface for authentication and product management.

---

## 🛠️ Tech Stack

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Fetch API**

---

## ✨ Features

### Authentication

* User login
* User registration
* Persistent access-token handling
* Current-user authentication check
* Logout
* Authentication error handling

### Product Management

* View all products
* Add a product
* Edit a product
* Delete a product
* Product form handling
* Product API error handling
* Product refresh after mutations

### UI

* Responsive dashboard layout
* Authentication form
* Product creation/edit form
* Product cards
* Product images
* Empty product state
* Login/register switching
* Loading and API feedback messages

---

## 📁 Project Structure

```text
client/
├── src/
│   ├── api.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### `src/api.ts`

Contains the centralized API request utility.

Responsibilities:

* Stores the access token
* Reads the API URL from the Vite environment
* Sends requests to the backend
* Automatically attaches the Bearer token
* Sends cookies with requests
* Parses API responses
* Converts backend validation errors into frontend-friendly error messages

The API base URL is configured using:

```ts
const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";
```

---

### `src/App.tsx`

Contains the main application UI and state management.

The component manages:

* Current authenticated user
* Product list
* Login/register mode
* Product form state
* Currently edited product
* API feedback messages

It also handles:

* Authentication requests
* Product creation
* Product updates
* Product deletion
* Logout
* Initial product loading
* Initial authentication verification

---

### `src/main.tsx`

The React entry point.

It creates the React root and renders the main `App` component.

```tsx
createRoot(document.getElementById("root")!).render(
  <App />,
);
```

---

### `src/styles.css`

Contains the application's Tailwind CSS setup and shared styling.

It defines:

* Application colors
* Global typography
* Input styling
* Button styling
* Primary button styles
* Secondary button styles
* Page background

---

## ⚙️ Installation

Make sure Node.js is installed.

From the `client` directory:

```bash
npm install
```

---

## 🔧 Environment Variables

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### `VITE_API_URL`

The base URL of the backend API.

For example:

```env
VITE_API_URL=https://your-api-domain.com/api
```

If this variable is not provided, the application falls back to:

```text
http://localhost:5000/api
```

---

## ▶️ Development

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🏗️ Production Build

Create a production build:

```bash
npm run build
```

The generated files will be placed inside:

```text
dist/
```

---

## 🔍 Linting

Run ESLint with:

```bash
npm run lint
```

---

# 🔐 Authentication Flow

The frontend uses the access token returned by the login API.

### Login

```text
User
 │
 │ enters email + password
 ▼
React login form
 │
 ▼
POST /api/auth/login
 │
 ├── accessToken
 ├── user
 └── refreshToken → httpOnly cookie
 │
 ▼
setToken(accessToken)
 │
 ▼
access token stored in localStorage
```

The access token is then automatically attached to protected API requests:

```http
Authorization: Bearer <access_token>
```

The refresh token is handled by the browser as a cookie and is not manually stored by the frontend.

---

# 🔄 Initial Authentication Check

When the application starts, it first loads the public product list.

If an access token exists in `localStorage`, the application calls:

```http
GET /api/auth/me
```

If the token is valid:

```text
API
 ↓
Current user
 ↓
setUser(...)
 ↓
Authenticated dashboard
```

If the token is invalid or expired:

```text
GET /api/auth/me
 ↓
Error
 ↓
Remove access token
 ↓
User becomes logged out
```

---

# 📡 API Communication

All API requests go through:

```text
src/api.ts
```

The request helper automatically:

1. Builds the complete API URL.
2. Sets `Content-Type: application/json`.
3. Adds the access token when available.
4. Sends cookies using `credentials: "include"`.
5. Parses the JSON response.
6. Throws a readable error when the API returns a non-success response.

Example:

```ts
request("/products")
```

Authenticated requests automatically become:

```http
GET /api/products
Authorization: Bearer <access_token>
```

---

# 🛍️ Product Operations

### Load products

```http
GET /api/products
```

The returned products are stored in React state.

---

### Create product

```http
POST /api/products
```

The frontend sends:

```json
{
  "name": "Wireless Keyboard",
  "description": "Compact mechanical keyboard",
  "price": 79.99,
  "stock": 12,
  "imageUrl": "https://example.com/keyboard.jpg"
}
```

After a successful request, the product list is loaded again.

---

### Update product

```http
PUT /api/products/:id
```

When a product is selected for editing, its information is placed into the product form.

The same form is then used for updating the product.

---

### Delete product

```http
DELETE /api/products/:id
```

The frontend asks for confirmation before sending the delete request.

After successful deletion, the product list is refreshed.

---

# 🔄 Frontend Data Flow

```text
                 React UI
                    │
          ┌─────────┴─────────┐
          │                   │
      Auth Forms        Product Forms
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
                api.ts
                    │
                    │ HTTP / JSON
                    ▼
              Express API
                    │
                    ▼
                MongoDB
                    │
                    ▼
              JSON Response
                    │
                    ▼
                React State
                    │
                    ▼
                 UI Update
```

---

# 📋 Backend Endpoints Used

| Method   | Endpoint             | Frontend Usage       |
| -------- | -------------------- | -------------------- |
| `POST`   | `/api/auth/register` | Registration         |
| `POST`   | `/api/auth/login`    | Login                |
| `POST`   | `/api/auth/logout`   | Logout               |
| `GET`    | `/api/auth/me`       | Authentication check |
| `GET`    | `/api/products`      | Product listing      |
| `POST`   | `/api/products`      | Create product       |
| `PUT`    | `/api/products/:id`  | Edit product         |
| `DELETE` | `/api/products/:id`  | Delete product       |

---

# 🧩 Main Frontend State

The application maintains the following main state:

```text
user
```

Stores the currently authenticated user.

```text
products
```

Stores the list of products returned by the API.

```text
authMode
```

Controls whether the authentication form is displaying login or registration.

```text
form
```

Stores the current product form values.

```text
editing
```

Stores the product currently being edited.

```text
message
```

Displays API success and error messages.

---

# 📦 Build Output

After running:

```bash
npm run build
```

Vite generates:

```text
client/
└── dist/
    ├── assets/
    └── index.html
```

The `dist` directory contains the production-ready frontend.

---

## 🔗 Related Documentation

For backend architecture, authentication, database models, validation, and API implementation, see:

```text
../server/README.md
```

For the complete project setup and assignment requirements, see:

```text
../README.md
```

---

## 👨‍💻 Author

**Bismay**

Built for the **Sheryians Coding School Authentication & Product CRUD Assignment**.
