#! /usr/bin/env node

// 'This script populates schools to your database. Specified database and source file as arguments - 
// e.g.: node populateSchools mongodb://127.0.0.1:27017/schoolbag?retryWrites=true ./schools.json');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var School = require('../models/school')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
var sourceFile = userArgs[1];

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let data = require(sourceFile);
if (!Array.isArray(data)) {
    console.log(data);
} else {
    (async () => {
        await School.insertMany(data);
        await db.close();
    })().then(() => process.exit());
}


