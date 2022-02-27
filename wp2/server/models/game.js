const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const GameSchema = new Schema({
    id: {type: String, required: true},
    username: {type: String, required: true},
    grid: {type: Array, required: true},
    winner: {type: String, required: true},
    start_date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Game', GameSchema)