const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/userProfile', (req, res) => res.render('users/user-profile'));


// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));


// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
//     console.log('The form data: ', req.body);
const { username, email, password } = req.body;

// make sure passwords are 6 characters or more:
const regex = /.{6,}/;
if (!regex.test(password)) {
  res
    .status(500)
    .render('auth/signup', { errorMessage: 'Password needs to have at least 6 characters.' });
  return;
}

  // make sure users fill all mandatory fields:
  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }
 
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
    //   console.log(`Password hash: ${hashedPassword}`);
    return User.create({
        // username: username
        username,
        email,
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
    //   console.log('New created user is: ', userFromDB);
    res.redirect('/userProfile');
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    })
});


module.exports = router;
