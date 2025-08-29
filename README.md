# Digital Library API 📚
A feature-rich backend API for an online library, built with Node.js, Express, and MongoDB. Powers user authentication, book purchasing, borrowing via subscriptions, and a complete admin management system.


## 🛫 Setup
### ✅ Prerequisites
- Node.js (v18.x or later)
- npm 
- MongoDB (local instance configured as a replica set or MongoDB Atlas)

### 🔑 Environment Variables

To run this project, you will need to add the following environment variables to a .env file in the root directory.

Create a .env file and add the following:

```env
# MongoDB Connection String
MONGO_URI=mongodb://127.0.0.1:27017/my-auth-app

# JWT Secret Key
JWT_SECRET=thisisareallystrongandsecretkey

# Port Number
PORT=5001
```

### 🪖 Installation & Setup

Clone the repository:
```bash
git clone https://github.com/r6mez/Digital-Library-API.git
cd Digital-Library-API
```

Install dependencies:
``` bash
 npm install
```

Running the Application
To start the server in development mode (with auto-restart), run:

```bash
npm start
```

The server will be running on http://localhost:5001.

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi / express-validator

## 🗃️ Database
**User**
`(id, name, email, password, money, isAdmin, createdAt, updatedAt)`

**Category**
`(id, name)`

**BookType** 
`(id, name)`

**Book**
`(id, name, author, description, cover_image_url, publication_date, category, type, buy_price, borrow_price_per_day, pdf_path, createdAt, updatedAt)`

**Owend Book**
`(id, user, book, createdAt)`

**Borrowed Book**
`(id, user, book, borrow_date, return_date, createdAt)`

**Subscription**
`(id, name, maximum_borrow, price, duration_in_days)`

**ActiveSubscription** 
`(id, subscription, user, start_date, deadline, createdAt, updatedAt)`

**Offer** 
`(id, user, original_price, discounted_price, expiresAt, createdAt, updatedAt)`

**OfferedBook**
`(id, offer, book)`

**Transaction** 
`(id, user, amount, type, description, createdAt)`
* `type` can be `'PURCHASE'`, `'SUBSCRIPTION'`, `'BRROW'`, etc.



## 🗺️ End points

User
- **POST** `/login` 
	- email, password
- **POST** `/register`
	- name, email, password
- **GET** `/users/me` -> returns logged-in user data
- **GET** `/users/me/subscription` -> return your active subscription plan
- **GET** `/users/me/transactions` -> return your transaction history

Books
- **GET** `/books` -> returns all books **(with pagination, e.g., `?page=1&limit=20`)**
- **GET** `/books?name=<book_name>&type="type"&category="category"`
- **GET** `/books/{id}` -> returns book details
- **POST** `/books/{id}` -> add a new book
    - name, author, category, format, buy_price, borrow_price_per_day, etc.
- **PUT**  `/books/{id}` -> update book
    - name, author, category, format, buy_price, borrow_price_per_day, etc.
- **DELETE** `/books/{id}` -> deletes a book
- **GET** `/books/{id}/pdf` -> return book file, path
- **POST** `/books/{id}/buy` 
	- user sends a request to buy a book, server check if the user has money >= book buy_price, if not sends error, else بيزبط الدنيا
- **POST** `/books/{id}/borrow`
	- duration_in_days 
	- check if user is subscribed, then check number of remaining books to borrow

Subscription
- **GET** `/subscription` -> get all subscriptions 
- **POST** `/subscription` -> adds a new subscription
	- maximum_borrow, price, duration_in_days
- **PUT** `/subscription/{id}` -> updates
	- maximum_borrow, price, duration_in_day
- **DELETE** `/subscription/{id}` -> deletes
- **POST** `/subscriptions/{id}/activate`

Offers
- **POST** `/offer` 
	- array of books ids
	- array of books ids
	- -> response offer (include an `expiresAt` timestamp and expire after 24 hours)
- **GET** `/offer/{id}` -> gets the offer, the price, the books included
- **POST** `/offer/{id}/accept` -> buy all of the books in the offer with the discounted price

Notes about expiry
- Offers have an `expiresAt` field and by default expire 24 hours after creation.
- Operations on expired offers (read, accept, update) will return HTTP 410 Gone with a message indicating the offer has expired.
- Admins can still manage offers via admin endpoints, but expired offers are treated as gone by the standard offer endpoints (see API docs / Swagger for admin routes).


## 📝 Notes
- **Authentication**: Use **JSON Web Tokens (JWT)** for authenticating users.
- **Authorization**: Implement **Role-Based Access Control (RBAC)**. A middleware should check for the `isAdmin` flag on user profiles to protect all `/*` routes.
- **Input Validation**: All incoming data from request bodies must be validated to ensure it's in the correct format and prevent security vulnerabilities. Use a library like `Joi` or `express-validator`.
- **Error Handling**: Create a centralized error handling mechanism. Use standard HTTP status codes (`400`, `401`, `403`, `404`, `500`) and return meaningful JSON error messages.

## TEST 

- [x] user controller 
- [x] book controller 
- [ ] offer
- [ ] borrow logic 
- [ ] subscription controller 
