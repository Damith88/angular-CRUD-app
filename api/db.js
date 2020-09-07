var mongoose = require('mongoose');
let mongoHost = process.env.MONGO_HOST || '127.0.0.1';
let mongoDatabase = process.env.MONGO_DATABASE || 'schoolbag';
var mongoDB = `mongodb://${mongoHost}:27017/${mongoDatabase}`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;

module.exports = db;