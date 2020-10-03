var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizSchema = new Schema({
    Author: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    Title: String,
    Questions: [], //json
    Genre: String,
    Type: String,
    Time: Number,
    Taken: [{User: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}, Score:Number, TimeTaken:Number}],
    Publish: Boolean
})

module.exports = mongoose.model('Quiz', quizSchema);