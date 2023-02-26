const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userwithsamename = users.filter((user)=>{
        return user.username == username;
    }
    );
    if(userwithsamename.length >0){
        return true;
    }else{
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUsers = users.filter((user)=>{
        return (user.username == username && user.password == password);
    }
    );
    if(validUsers.length >0){
        return true;
    }else{
        return false;
    }
}

//TASK 7: only registered users can login
regd_users.post("/login", (req,res) => {
    
    const username = req.body.username;
    const password = req.body.password;
    
    if(!username||!password){
        return res.status(404).json({message: "Error logging in"});
    }

    if(authenticatedUser(username,password)){
        let accessToken = jwt.sign(
            {data: password},'access',{expiresIn: 60*60}
        );
    req.session.authorization = {
        accessToken, username
    }
    req.session.userNameInSession = username
    return res.status(200).send("User successfully logged in");
    }else{
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// TASK 8:  Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let rew = req.body.review;
    let username = req.session.userNameInSession;
    console.debug(username);
    if(authenticatedUser(username)){
        books[isbn]["reviews"][username]=rew;
        return res.status(200).send("Review Correctely added");
    }else{
        return res.status(404).json({message: "Invalid Login. Check username and password"});
    }
});    

// TASK 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let username = req.body.username;
    let isbn = req.params.isbn;
    if(authenticatedUser(username)){
        if(isbn&&books[isbn]['reviews'][username]){
            delete books[isbn]['reviews'][username];
        }else{
            return res.status(404).json({message: "This book doesn't have any review to delete or you don't have enough permissions to do it"});
        }
    }else{
        return res.status(404).json({message: "Invalid Login. Check username and password"});
    }

    return res.status(200).send("Review correctely deleted");
});

regd_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;