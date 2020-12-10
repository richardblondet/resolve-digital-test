var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Users = new Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
});

// Export the model
module.exports = mongoose.model('Users', Users);