const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    }
})

const authorModel = mongoose.model("Author", authorSchema);

module.exports = authorModel;