var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Urls = new Schema({
  url: {type: String, required: true},
  title: {type: String},
  code: {type: String},
  timesAccessed: {type: Number}
});

// Export the model
module.exports = mongoose.model('urls', Urls);