const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(u => u.username === username && u.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;

    if (username && password) {

        if (authenticatedUser(username, password)) {
            const accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});
            req.session.authorization = {
                accessToken, username
            };
            return res.status(200).json({message: "Login successful!"});
        } else {
            return res.status(208).json({message: "Invalid Username or Password!"});
        }

    }

    return res.status(404).json({message: "Username or/and password not found!"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let message = "ISBN and/or Review not found!";
    const isbn = req.params.isbn;
    const review = req.body.review;

    if (isbn && review) {
        const book = books[isbn];

        if (!book) {
            message = `No book found for ISBN: ${isbn}`;
            return res.status(200).json({message});    
        }

        const username = req.session.authorization.username;
        book.reviews[username] = review;
        message = "Review added/updated successfully";
        return res.status(200).json({message});    
    }

    return res.status(200).json({message});  
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let message = "ISBN not found!";

    if (isbn) {
        const book = books[isbn];

        if (!book) {
            message = `No book found for ISBN: ${isbn}`;
            return res.status(200).json({message});    
        }

        const username = req.session.authorization.username;
        delete book.reviews[username];
        message = `Review for ISBN ${isbn} deleted`;
        return res.status(200).json({message});
    }

    return res.status(200).json({message});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
