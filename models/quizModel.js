var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizSchema = new Schema({
    Author: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    Title: String,
    Questions: [String], //json
    Answers: [String],
    Genre: String,
    Type: String,
    Time: Number,
    Taken: Number,
    Publish: Boolean
})

module.exports = mongoose.model('Quiz', quizSchema);