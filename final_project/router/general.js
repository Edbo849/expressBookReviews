const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const fetchBooks = async () => {
    try {
      const response = await axios.get('https://edborthwick8-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai');
      return response.data.books; 
    } catch (error) {
      throw new Error('Failed to fetch books');
    }
  };
  
public_users.get('/', async function (req, res) {
    try {
      const books = await fetchBooks();
      res.status(200).json({ books: books });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

const fetchBookByISBN = async (isbn) => {
    try {
      const response = await axios.get(`https://edborthwick8-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`);
      return response.data.book;
    } catch (error) {
      throw new Error('Failed to fetch book details');
    }
  };

const fetchBooksByAuthor = async (author) => {
    try {
      const response = await axios.get(`https://edborthwick8-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/${author}`); // Assuming the endpoint for getting books by author is '/author/:author'
      return response.data.booksByAuthor; // Assuming the response contains books by author
    } catch (error) {
      throw new Error('Failed to fetch books by author');
    }
  };
  
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
      const booksByAuthor = await fetchBooksByAuthor(author);
      res.status(200).json({ booksByAuthor: booksByAuthor });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
      const book = await fetchBookByISBN(isbn);
      res.status(200).json({ book: book });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

const fetchBooksByTitle = async (title) => {
    try {
      const response = await axios.get(`https://edborthwick8-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/${title}`);
      return response.data.booksByTitle;
    } catch (error) {
      throw new Error('Failed to fetch books by title');
    }
  };
  
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
      const booksByTitle = await fetchBooksByTitle(title);
      res.status(200).json({ booksByTitle: booksByTitle });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (users[username]) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    users.push({username, password})

    
    res.status(201).json({ message: "User registered successfully" });
  });
  
public_users.get('/',function (req, res) {
  res.status(200).json({ books: books });
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    const book = Object.values(books).find(book => book.isbn === isbn);
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    res.status(200).json({ book: book });
  });
  
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; 
  
    const booksByAuthor = [];
  
    for (const [key, book] of Object.entries(books)) {
      if (book.author === author) {
        booksByAuthor.push({ id: key, ...book });
      }
    }
  
    if (booksByAuthor.length === 0) {
      return res.status(404).json({ message: "Books by this author not found" });
    }
  
    res.status(200).json({ booksByAuthor: booksByAuthor });
  });
  
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    const booksByTitle = [];
  
    for (const [key, book] of Object.entries(books)) {
      if (book.title.toLowerCase().includes(title.toLowerCase())) {
        booksByTitle.push({ id: key, ...book });
      }
    }
  
    if (booksByTitle.length === 0) {
      return res.status(404).json({ message: "Books with this title not found" });
    }
  
    res.status(200).json({ booksByTitle: booksByTitle });
  });
  

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const book = Object.values(books).find(book => book.isbn === isbn);
    const bookReviews = book.reviews;
  
    res.status(200).json({ reviews: bookReviews });
  });
  

module.exports.general = public_users;
