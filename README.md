# Live Link :  https://cadbrary-vaibhav.onrender.com

# cadBrary

# Library Management API

## Overview

This API provides endpoints for managing books and authors in a library. It allows users to retrieve information about books and authors, add new books and authors, update existing information, and delete books and authors from the library.

## Getting Started

These instructions will help you set up and run the API on your local machine.

### Prerequisites

- Node.js installed on your machine
- MongoDB installed and running

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/library-management-api.git
    ```

2. **Change into the project directory:**

    ```bash
    cd library-management-api
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Set up environment variables:**

    Create a `.env` file in the project root and add the following:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    ```

5. **Run the application:**

    ```bash
    npm start
    ```

   The API will be accessible at `http://localhost:3000`.

## API Endpoints

### Books

#### Get all books

- **URL**: `/books/`
- **Method**: `GET`
- **Query Parameters**:
    - `title` (optional): Filter books by title (case-insensitive).
    - `publishAfter` (optional): Filter books published after a specific date.
    - `publishBefore` (optional): Filter books published before a specific date.

#### Create a new book

- **URL**: `/books/`
- **Method**: `POST`
- **Request Body**:
    - `title`: Title of the book.
    - `description`: Description of the book.
    - `publishDate`: Publication date of the book.
    - `pageCount`: Number of pages in the book.
    - `author`: Author of the book.
    - `cover` (optional): Base64-encoded cover image of the book.

#### Get a specific book

- **URL**: `/books/:id`
- **Method**: `GET`
- **URL Parameters**:
    - `id`: The unique identifier of the book.

#### Update a book

- **URL**: `/books/:id`
- **Method**: `PUT`
- **URL Parameters**:
    - `id`: The unique identifier of the book.
- **Request Body**:
    - `title`: New title of the book.
    - `author`: New author of the book.
    - `publishDate`: New publication date of the book.
    - `pageCount`: New number of pages in the book.
    - `description`: New description of the book.
    - `cover` (optional): Base64-encoded new cover image of the book.

#### Delete a book

- **URL**: `/books/:id`
- **Method**: `DELETE`
- **URL Parameters**:
    - `id`: The unique identifier of the book.

### Authors

#### Get all authors

- **URL**: `/authors/`
- **Method**: `GET`
- **Query Parameters**:
    - `name` (optional): Filter authors by name (case-insensitive).

#### Create a new author

- **URL**: `/authors/`
- **Method**: `POST`
- **Request Body**:
    - `name`: Name of the author.

#### Get a specific author

- **URL**: `/authors/:id`
- **Method**: `GET`
- **URL Parameters**:
    - `id`: The unique identifier of the author.

#### Update an author

- **URL**: `/authors/:id`
- **Method**: `PUT`
- **URL Parameters**:
    - `id`: The unique identifier of the author.
- **Request Body**:
    - `name`: New name of the author.

#### Delete an author

- **URL**: `/authors/:id`
- **Method**: `DELETE`
- **URL Parameters**:
    - `id`: The unique identifier of the author.


