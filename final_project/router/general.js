const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const {username, password} = req.body;

    if (username && password) {
        const doesUserExist = users.find(u => u.username === username);

        if (!doesUserExist) {
            users.push({username, password});
            return res.status(200).json({message: "User successfully registered!"});
        } else {
            return res.status(404).json({message: "Username already taken!"});
        }

    }

    return res.status(404).json({message: "Username or/and password not found!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books), null, 4);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    for (const book of Object.values(books)) {
        
        if (book.author === author) {
            return res.status(200).json(book);
        } 

    }
    
    return res.status(404).json({message: `No book found with author ${author}`});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    for (const book of Object.values(books)) {
        
        if (book.title === title) {
            return res.status(200).json(book);
        } 

    }
    
    return res.status(404).json({message: `No book found with title ${title}`});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(books[isbn].reviews);
});

getAllBooks();
getBookByIsbn(4);
getBookByAuthor('Jane Austen')
getBookByTitle('The Divine Comedy')

// Using Promise
function getAllBooks() {

    axios.get('http://localhost:5000/')
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        })

}

async function getBookByIsbn(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        if (response.status === 200 && response.data) {
            console.log(`Book with ISBN ${isbn}:`, response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No book found with ISBN ${isbn}`);
        } else {
            console.error('Error fetching book by ISBN:', error.message);
        }
    }
}

async function getBookByAuthor(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        if (response.status === 200 && response.data) {
            console.log(`Book by author ${author}:`, response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No book found with author ${author}`);
        } else {
            console.error('Error fetching book by author:', error.message);
        }
    }
}

async function getBookByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        if (response.status === 200 && response.data) {
            console.log(`Book with title ${title}:`, response.data);
            return response.data;
        }
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`No book found with title ${title}`);
        } else {
            console.error('Error fetching book by title:', error.message);
        }
    }
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBooksByIsbn = getBookByIsbn;
module.exports.getBooksByAuthor = getBookByAuthor;
module.exports.getBooksByTitle = getBookByTitle;