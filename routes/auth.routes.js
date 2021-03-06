const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const Ad = require('../models/Ad')


// middleware to protect a route
const loginCheck = () => {
  return (req, res, next) => {
    // check for a logged in user
    if (req.session.user) {
      next()
    } else {
      res.redirect('/login')
    }
  }
}


router.get('/userProfile', loginCheck(), (req, res) => {
  Ad.find({owner: req.session.user._id })
  .then(adFromDB => {
    res.render('users/user-profile', { ad: adFromDB, user: req.session.user })

  })
  .catch(err => next(err))
});


// GET login route
 
// GET route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// removed /signup route
// GET route ==> to display the signup form to users
// router.get('/signup', (req, res) => res.render('auth/signup'));



// POST login route

// POST login route ==> to process form data
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
   
    if (email === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
   
    User.findOne({ email })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
          return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
            req.session.user = user;
          
          res.redirect('/userProfile')
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
      
  });


// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
//     console.log('The form data: ', req.body);
const { username, email, password } = req.body;

// make sure passwords are 6 characters or more:
const regex = /.{6,}/;
if (!regex.test(password)) {
  res
    .status(500)
    .render('auth/login', { errorMessage: 'Password needs to have at least 6 characters.' });
  return;
}

  // make sure users fill all mandatory fields:
  if (!username || !email || !password) {
    res.render('auth/login', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
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
        passwordHash: hashedPassword, 
        imgPath: 'https://res.cloudinary.com/johanneskessel/image/upload/v1637854269/profile-picture-uploads/LogoDefault_vm94mc.png',
      });
    })
    .then(userFromDB => {
    //   console.log('New created user is: ', userFromDB);
    
    res.redirect('/login');
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/login', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/login', {
           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    })
});

// Logout route
router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });


module.exports = router;

