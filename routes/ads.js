const router = require("express").Router();
const { addListener } = require("../app");
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

// List all ads

router.get('/', (req, res, next) => {
		
	Ad.find()
		.then(adsFromDB => {
			
			res.render('home', { adList: adsFromDB, user: req.session.user })
		})
		.catch(err => next(err))
}); 

// Filter ads by category

router.get('/filter', (req, res, next) => {
	let activeCategory = req.query.category
	Ad.find({category: activeCategory})
		.then(adsFromDB => {
			
			res.render('home', { adList: adsFromDB, category:activeCategory, user: req.session.user})
		})
		.catch(err => next(err))
}); 

// Search ads by city 

router.post('/search', (req, res, next) => {
	let searchText = req.body.search
	if (searchText == ""){res.redirect("/")}
	Ad.find({'address.city': searchText})
		.then(adsFromDB => {
			
			res.render('home', { adList: adsFromDB, search:searchText, user: req.session.user})
		})
		.catch(err => next(err))
	
}); 



// Create new Ad

router.get('/ads/add', loginCheck(), (req, res, next) => {
	res.render('ads/addForm', {user: req.session.user})
});

router.post('/ads', (req, res, next) => {
	 
	const { title, category, time, date, street, number, zipcode, city, description, price } = req.body
	

	Ad.create({
	  title: title,
	  category: category,
	  time: time,
	  date: date,
	  address: {
          street: street,
          number: number,
          zipcode: zipcode,
          city: city,
      },
	  description: description,
	  price: price,
	  owner: req.session.user._id,
	})
		.then(createdAd => {
			
			res.redirect(`/ads/${createdAd._id}`)
		})
        .catch(err => next(err))
});

// Display Ad

router.get('/ads/:id', loginCheck(), (req, res, next) => {
	const id = req.params.id
	Ad.findById(id)
		.then(adFromDB => {
			res.render('ads/details', { ad: adFromDB, user: req.session.user })
		})
		.catch(err => next(err))
});

// Edit Ad

router.get('/ads/edit/:id', loginCheck(), (req, res, next) => {
	const id = req.params.id
	Ad.findById(id)
		.then(adFromDB => {
			res.render('ads/editForm', { ad: adFromDB, user: req.session.user })
		})
		.catch(err => next(err))
});

router.post('/ads/edit/:id', (req, res, next) => {
	const id = req.params.id
	
	const { title, category, time, date, street, number, zipcode, city, description, price } = req.body
	Ad.findByIdAndUpdate(id, {
	  title,
	  category,
	  time,
	  date, 
	  address: {
        street: street,
        number: number,
        zipcode: zipcode,
        city: city,
    },
	  description,
	  price,
	}, { new: true })
		.then(updatedAd => {
			
			res.redirect(`/ads/${updatedAd._id}`)
		})
		.catch(err => next(err))
});

// Delete Ad

router.get('/ads/delete/:id', loginCheck(), (req, res, next) => {
	const id = req.params.id
	Ad.findByIdAndDelete(id)
		.then(() => {
			res.redirect('/userProfile')
		})
		.catch(err => {
			next(err)
		})
});



module.exports = router;