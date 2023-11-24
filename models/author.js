const mongoose = require('mongoose');
const Book = require('./book');

const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    }
})

authorSchema.pre('deleteOne', async function(next) {
   
    Book.find({ author: this.id }, (err, books) => {
      if (err) {
        next(err)
      } else if (books.length > 0) {
        next(new Error('This author has books still'))
      } else {
        
        next()
      }
    })
  })

const authorModel = mongoose.model("Author", authorSchema);

module.exports = authorModel;