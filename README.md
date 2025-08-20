# Database
User
(id, name, email, password, isAdmin, money)

Category
(id, name)

type
(id, name)

book
(id, name, author, category_id, type_id, buy_price, borrow_price_per_day, pdf_path)

owned
(id, user_id, book_id)

borrowed
(id, user_id, book_id, deadline)

subscribtion
(id, maximum_borrow, price, duration_in_days)
5 books -> 10$ -> 1 month

active_subscribtion
(id, subscribtion_id, user_id, counter, deadline)

Offers
(id, price)

offered_books
(id, offer_id, book_id)

---
# End points
User
- **POST** /login 
	- email
	- password
- **POST** /register
	- name
	- email
	- password
	- repeated password
- **GET** /profile -> returns user data
- **GET** /profile/subscribtion -> return your subscribtion plan

Books
- **GET** /books -> returns all books
- **GET** /books?name=<book_name>&type="type"&category="category"
- **GET** /book/{id} -> returns book details
- **POST** /book/{id} -> add book
	- name
	- author
	- category_id
	- type_id
	- own_price
	- borrow_price
- **PUT**  /book/{id} -> update book
	- name
	- author
	- category_id
	- type_id
	- own_price
	- borrow_price
- **DELETE** /book/{id} -> deletes a book
- **GET** /book/{id}/pdf -> return book file, path
- **POST** /book/{id}/buy 
	- user_id
	- user sends a request to buy a book, server check if the user has money >= book buy_price, if not sends error, else بيزبط الدنيا
- **POST** /book/{id}/borrow
	- user_id
	- duration_in_days 
	- check if user is subscribed, then check number of remaining books to borrow

Subscribtion
- **GET** /subscribtion -> get all subscribtions 
- **POST** /subscribtion -> adds a new subscribtion
	- maximum_borrow, price, duration_in_days
- **PUT** /subscribtion/{id} -> updates
	- maximum_borrow, price, duration_in_day
- **DELETE** /subscribtion/{id} -> deletes
- **POST** /subscribe/{id}
	- user_id

Offers
- **POST** /offer 
	- array of books ids
	- -> response offer_id
- **GET** /offer/{id} -> gets the offer, the price, the books included
- **POST** /offer/{id}/accept -> buy all of the books in the offer with the discounted price

---
# Notes
- tokens for autherization

---
# Tasks
- [ ] Setup github and the project
- [ ] Create models for all entites
- [ ] User entity 
- [ ] Book entity
- [ ] subscription entity
- [ ] Offers 

---
# Stack
- DB: local mongoDB
- express

---