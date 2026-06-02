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
            return res.status(200).json({message: "User successfully logged in!"});
        } else {
            return res.status(208).json({message: "Invalid Username or Password!"});
        }

    }

    return res.status(404).json({message: "Username or/and password not found!"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const book = books[isbn];
    const username = req.session.authorization.username;
    book.reviews[username] = review;
    return res.status(200).json({message: "Review saved successfully"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const book = books[isbn];
    delete book.reviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
