const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    createdAt:{
        type:Date, 
        default:Date.now, 
        index: {expires: 300
    }}
    // After 5 min it is deleted automatically from the database
}, {
    timestamps:true
});

const Otp = mongoose.model("Otp", OtpSchema);

module.exports = Otp;