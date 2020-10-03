var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizSchema = new Schema({
    Author: Number,
    Title: String,
    Questions: [], //json
    Genre: Number,
    Type: String,
    Time: Number,
    Plays: Number,
    Leaderboard: []
})

module.exports = mongoose.model('Quiz', quizSchema);