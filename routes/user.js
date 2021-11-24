const router = require("express").Router();
const { addListener } = require("../app");
const Ad = require('../models/Ad');
const User = require("../models/User.model");
const {uploader, cloudinary} = require("../config/cloudinary")

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

  router.post('/userProfile/edit', uploader.single("profileImg"), (req, res, next) => {
	const user = req.session.user;
  const imgPath = req.file.path;
  const imgName = req.file.originalname;
  const publicId = req.file.filename;
  const { street, number, zipcode, city } = req.body

  // if (req.session.user.publicId !== req.file.filename){
  //   cloudinary.uploader.destroy(publicId)
  //   }

	User.findByIdAndUpdate(user, {
	
	  address: {
        street: street,
        number: number,
        zipcode: zipcode,
        city: city,
    },
    imgPath: imgPath,
    imgName: imgName,
    publicId: publicId,
	  
  }, { new: true })
		.then(updatedUser => {
      

      req.session.user = updatedUser
                
			res.redirect("/userProfile")
		})
		.catch(err => next(err))
});

module.exports = router;