const mongoose = require('mongoose');

var Quiz = mongoose.model("quiz", {

    Title: String,
    Questions: [String],
    Answers: [String],
    Genre: Number,
    Type: String,
    Time: Number
})

module.exports = {
    Quiz
}