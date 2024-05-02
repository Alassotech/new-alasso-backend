// DressModel.js
const mongoose = require('mongoose')

const dressSchema = new mongoose.Schema({
  name: String,
  uid: String,
  number: String,
  selectedItems: [String],
  pantsColor: String,
  upiId: String,
  size: String,
  cost: String
})

const Dress = mongoose.model('Dress', dressSchema)

module.exports = Dress
