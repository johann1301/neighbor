const router = require("express").Router();
const Ad = require('../models/Ad')

router.get('/ads/add', (req, res, next) => {
	res.render('ads/addForm')
});

router.post('/ads', (req, res, next) => {
	
	const { title, category, time, date, address, description, price } = req.body
	// console.log(title, description, author, rating)
    console.log(req.body)
	// create a new book
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
			console.log(createdAd)
			// show the book details for the created book
			// res.render('books/details', { book: createdBook })
			res.redirect(`/ads/${createdAd._id}`)
		})
});

module.exports = router;