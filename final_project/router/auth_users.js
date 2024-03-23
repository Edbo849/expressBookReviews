const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'default_secret';

const isValid = (username)=>{ 
    }

const authenticatedUser = (username,password)=>{
    const user = users.find(user => user.username === username && user.password === password);
    return true;
}

regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const accessToken = jwt.sign({ username: username }, accessTokenSecret);

    req.session.user = { username: username, accessToken: accessToken };

    return res.status(200).json({ message: "Login successful", accessToken: accessToken });
  });
  

regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.user.username;

    console.log(isbn, review, username);
  
    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews[username]) {
      books[isbn].reviews[username] = review;
    } else {
      books[isbn].reviews[username] = review;
    }
  
    return res.status(200).json({ message: "Review added/modified successfully" });
  });
  

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.user.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  
    delete books[isbn].reviews[username];
  
    return res.status(200).json({ message: "Review deleted successfully" });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
