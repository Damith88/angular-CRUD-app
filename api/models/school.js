var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SchoolSchema = new Schema({
    name: {type: String, required: true},
    address: {
        street: {type: String},
        suburb: {type: String},
        state: {type: String},
        postcode: {type: String}
    },
    studentCount: { type: Number}
});

// Virtual for this school instance URL.
SchoolSchema
.virtual('url')
.get(function () {
  return '/api/schools/' + this._id;
});

// Export model.
module.exports = mongoose.model('School', SchoolSchema);
