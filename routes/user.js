const router = require("express").Router();
const { addListener } = require("../app");
const Ad = require('../models/Ad');
const User = require("../models/User.model");

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
  
  router.get('/userProfile/edit', loginCheck(), (req, res) => {
    const user = req.session.user;
    console.log(user)
            res.render('users/editUser', { user });
            
  
  });

  router.post('/userProfile/edit', (req, res, next) => {
	const user = req.session.user;
    const { street, number, zipcode, city } = req.body
	User.findByIdAndUpdate(user, {
	 
	  address: {
        street: street,
        number: number,
        zipcode: zipcode,
        city: city,
    },
	  
	}, { new: true })
		.then(updatedUser => {
                req.session.user = updatedUser
                
			res.redirect("/userProfile")
		})
		.catch(err => next(err))
});

module.exports = router;