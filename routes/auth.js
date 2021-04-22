

const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const { post } = require("../app");

router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.post('/signup', (req, res, next) => {
    //get username and password
    const {username, password} = req.body;
    console.log({username, password})

    //if username exists, and password matches allow sign up
    if (password.length < 8) {
        //if not, we show the signup form again with a message.
        res.render('signup', {message: 'your password has to be 8 char min'});
        return //what does this return exactly?
    }

    if (username === ''){
        res.render('signup', {message: 'Your username cannot be empty'})
        return
    }

    User.findOne({username: username}) //why is this inside the post request
        .then(userFromDB => {
            if (userFromDB !== null) {  
            res.render('signup', {message: 'This username is already taken'})
        } else {
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
            console.log(hash);

            User.create({username: username, password: hash})
                .then(createdUser => {
                    console.log(createdUser);
                    res.redirect('/');
                })
        }
    })      
});


module.exports = router;



