const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



// TASK 6:    Complete the code for registering a new user	
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
      if(!isValid(username)){
        users.push({"username":username, "password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      }else{
        return res.status(404).json({message: "User already exists!"});
      }
    }else{
        return res.status(404).json({message: "Unable to register user."});
    }
});

// TASK 1 : Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// TASK 2:  Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  res.send(books[req.params.isbn]);
 });
  
// TASK 3:  Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let filteredBooks = Object.values(books).filter((book)=>{
      return (book.author == req.params.author)
  });
  res.send(filteredBooks);
});

//TASK 4:  Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let filteredBooks = Object.values(books).filter((book)=>{
        return (book.title == req.params.title)
    });
    res.send(filteredBooks);
  });

//TASK 5:  Get book review
public_users.get('/review/:isbn',function (req, res) {
    console.debug(books)
    let rew  = books[req.params.isbn]['reviews'];
    console.debug(rew)

    if(rew){
        res.send(rew);
    }else{
        res.json({message:"There is no published reviews for this book yet"});
    }
});





module.exports.general = public_users;
