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
            res.render('users/editUser', { user });
            
  
  });

  

  router.post('/userProfile/edit', uploader.single("profileImg"), (req, res, next) => {
	const user = req.session.user;
  let imgPath;
  let imgName ;
  let publicId;
  if(req.file){
  imgPath = req.file.path;
  imgName = req.file.originalname;
  publicId = req.file.filename;
  } else {
    imgPath = req.session.user.imgPath;
    imgName = req.session.imgName;
    publicId = req.session.publicId;
  }
  const { street, number, zipcode, city } = req.body

  console.log("Hello", req.file)

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

      if(updatedUser.publicId !== user.publicId){
        cloudinary.uploader.destroy(user.publicId)
      }
                
			res.redirect("/userProfile")
		})
    
		.catch(err => next(err))
});

module.exports = router;