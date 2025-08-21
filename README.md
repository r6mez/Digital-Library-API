# Digital Library API 📚🛜
A feature-rich backend API for an online library, built with Node.js, Express, and MongoDB. Powers user authentication, book purchasing, borrowing via subscriptions, and a complete admin management system.

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

**BookFormat** 
`(id, name)`

**Book**
`(id, name, author, description, cover_image_url, publication_date, category_id, format_id, buy_price, borrow_price_per_day, pdf_path, createdAt, updatedAt)`

**Owned**
`(id, user_id, book_id, createdAt)`

**Borrowed**
`(id, user_id, book_id, borrow_date, deadline, createdAt)`

**Subscription**
`(id, name, maximum_borrow, price, duration_in_days)`

**ActiveSubscription** 
`(id, subscription_id, user_id, remaining_borrows, start_date, deadline, createdAt, updatedAt)`

**Offer** 
`(id, name, price, createdAt, updatedAt)`

**OfferedBook**
`(id, offer_id, book_id)`

**Transaction** 
`(id, user_id, amount, type, description, createdAt)`
* `type` can be `'PURCHASE'`, `'SUBSCRIPTION'`, `'REFUND'`, etc.



## 🗺️ End points

User
- **POST** `/login` 
	- email
	- password
- **POST** `/register`
	- name
	- email
	- password
	- repeated password
- **GET** `/users/me` -> returns logged-in user data
- **GET** `/users/me/subscription` -> return your active subscription plan
- **GET** `/users/me/transactions` -> return your transaction history

Books
- **GET** `/books` -> returns all books **(with pagination, e.g., `?page=1&limit=20`)**
- **GET** `/books?name=<book_name>&type="type"&category="category"`
- **GET** `/books/{id}` -> returns book details
- **POST** `/books/{id}` -> add a new book
    - name, author, category_id, format_id, buy_price, borrow_price_per_day, etc.
- **PUT**  `/books/{id}` -> update book
    - name, author, category_id, format_id, buy_price, borrow_price_per_day, etc.
- **DELETE** `/books/{id}` -> deletes a book
- **GET** `/books/{id}/pdf` -> return book file, path
- **POST** `/books/{id}/buy` 
	- user_id
	- user sends a request to buy a book, server check if the user has money >= book buy_price, if not sends error, else بيزبط الدنيا
- **POST** `/books/{id}/borrow`
	- user_id
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
	- user_id

Offers
- **POST** `/offer` 
	- array of books ids
	- -> response offer_id
- **GET** `/offer/{id}` -> gets the offer, the price, the books included
- **POST** `/offer/{id}/accept` -> buy all of the books in the offer with the discounted price


## 📝 Notes
- **Authentication**: Use **JSON Web Tokens (JWT)** for authenticating users.
- **Authorization**: Implement **Role-Based Access Control (RBAC)**. A middleware should check for the `isAdmin` flag on user profiles to protect all `/*` routes.
- **Input Validation**: All incoming data from request bodies must be validated to ensure it's in the correct format and prevent security vulnerabilities. Use a library like `Joi` or `express-validator`.
- **Error Handling**: Create a centralized error handling mechanism. Use standard HTTP status codes (`400`, `401`, `403`, `404`, `500`) and return meaningful JSON error messages.



## Tasks
- [ ] Setup github and the project
- [ ] Create models for all entites
- [ ] User entity 
- [ ] Book entity
- [ ] subscription entity
- [ ] Offers 
