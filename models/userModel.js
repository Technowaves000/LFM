const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    uid: ObjectId,
    Name: String,
    Password:String,
})

module.exports= mongoose.model('users', userSchema)