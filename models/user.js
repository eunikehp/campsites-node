const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // username: {  // deleted and then handled by plugin
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },

    admin: {
        type: Boolean,
        default: false //by default when a new user is created, the admin will be set to false.
    }
});

userSchema.plugin(passportLocalMongoose) //plugin that handle username and password along with hashing and salting

module.exports = mongoose. model('User', userSchema);