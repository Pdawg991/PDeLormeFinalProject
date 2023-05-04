const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    funfacts: {
        type: Array
    }
});
module.exports = mongoose.model('State', stateSchema);