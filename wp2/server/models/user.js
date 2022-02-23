const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema(
    {
        username: {type: String, require: true},
        password: {type: String, required: true},
        email: {type: String, required: true},
        verified: {type: Boolean, required: false}
    }
)

module.exports = mongoose.model('User', UserSchema)
