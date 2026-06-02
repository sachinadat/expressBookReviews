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
    
    return res.status(200).json({message: `No book found with author ${author}`});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    for (const book of Object.values(books)) {
        
        if (book.title === title) {
            return res.status(200).json(book);
        } 

    }
    
    return res.status(200).json({message: `No book found with title ${title}`});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(books[isbn].reviews);
});

getAllBooks();
getBooksByIsbn(4);
getBooksByAuthor('Jane Austen')
getBooksByTitle('The Divine Comedy')

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

function getBooksByIsbn(isbn) {

    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        })

}

// Using async/await
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

async function getBooksByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBooksByIsbn = getBooksByIsbn;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;