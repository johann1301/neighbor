const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const adSchema = new Schema({
	title: String,
	category: String,
	time: Number,
	date: Date,
	address: String,
	description: String,
	price: Number
}, {
	timestamps: true,
});

const Ad = mongoose.model('Ad', adSchema);
module.exports = Ad;