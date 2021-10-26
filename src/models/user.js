const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');

const UsersSchema = new mongoose.Schema({
    number: {
        type: Number,
        max: 9999999999,
        min: 1000000000,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowerCase: true,
        validate: function (value) {
            if (!validator.isEmail(value)) {
                throw new Error
                Error('please enter valid emailid');
            }
        }
    },
    password : {
        type : String,
        trim : true,
        required : true,
        minlength : 8,
        validate : function(value){
            if(value.includes('password')){
                throw new Error('please enter valid password');
            }
        }
    },
}, {
    timestamps: true
});

UsersSchema.pre('save', async function () {
    var user = this;
    if (user.password) {
        user.password = await bcrypt.hash(user.password, 8);
    }
});

UsersSchema.statics.findByCredential = async function (email, password) {
    var user = await Users.findOne({ email: email });
    if (!user) {
        throw new Error("Unable to Login");
    }
    var check = await bcrypt.compare(password, user.password);

    if (!check) {
        throw new Error("Unable to Login");
    }
    return user;
}

UsersSchema.methods.generateAuthToken = function () {
    var user = this;
    var token = jwt.sign({ _id: user._id},"jknasdcdoaicjadcnknki", {expiresIn: "1d" })
    return token;
}

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;