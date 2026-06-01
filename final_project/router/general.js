const express = require('express');
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
    
    return res.status(200).json({message: "No book found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    for (const book of Object.values(books)) {
        
        if (book.title === title) {
            return res.status(200).json(book);
        } 

    }
    
    return res.status(200).json({message: "No book found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(books[isbn].reviews);
});

module.exports.general = public_users;
