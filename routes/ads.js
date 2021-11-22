const router = require("express").Router();
const { addListener } = require("../app");
const Ad = require('../models/Ad')

// List all ads

router.get('/ads', (req, res, next) => {
		
	Ad.find()
		.then(adsFromDB => {
			
			res.render('ads/index', { adList: adsFromDB })
		})
		.catch(err => next(err))
});

// Create new Ad

router.get('/ads/add', (req, res, next) => {
	res.render('ads/addForm')
});

router.post('/ads', (req, res, next) => {
	
	const { title, category, time, date, address, description, price } = req.body
	
    console.log(req.body)
	
	Ad.create({
	  title: title,
	  category: category,
	  time: time,
	  date: date,
	  address: address,
	  description: description,
	  price: price
	})
		.then(createdAd => {
			
			res.redirect(`/ads/${createdAd._id}`)
		})
        .catch(err => next(err))
});

// Display Ad

router.get('/ads/:id', (req, res, next) => {
	const id = req.params.id
	Ad.findById(id)
		.then(adFromDB => {
			res.render('ads/details', { ad: adFromDB })
		})
		.catch(err => next(err))
});

// Edit Ad

router.get('/ads/edit/:id', (req, res, next) => {
	const id = req.params.id
	Ad.findById(id)
		.then(adFromDB => {
			res.render('ads/editForm', { ad: adFromDB })
		})
		.catch(err => next(err))
});

router.post('/ads/edit/:id', (req, res, next) => {
	const id = req.params.id
	
	const { title, category, time, date, address, description, price } = req.body
	Ad.findByIdAndUpdate(id, {
	  title,
	  category,
	  time,
	  date,
	  address,
	  description,
	  price,
	}, { new: true })
		.then(updatedAd => {
			console.log(updatedAd)
			
			res.redirect(`/ads/${updatedAd._id}`)
		})
		.catch(err => next(err))
});

// Delete Ad

router.get('/ads/delete/:id', (req, res, next) => {
	const id = req.params.id
	Ad.findByIdAndDelete(id)
		.then(() => {
			res.redirect('/ads')
		})
		.catch(err => {
			next(err)
		})
});



module.exports = router;