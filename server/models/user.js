const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            //below same as above
            // validator: (value) => {
            //     return validator.isEmail(value);
            // },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() { //this method which we will define as a regular function determines what exactly gets send back when a mongoose model is converted into a JSON value  
    var user = this;
    var userObject = user.toObject(); //responsible for taking your mongoose variable, user, and converting it into a regular object where only the properties available on the document exist 

    return _.pick(userObject, ['_id', 'email']);
};

//normal function used below. arrow functions do not bind a this keyword which will store the individual doc
UserSchema.methods.generateAuthToken = function() { //UserSchema.methods is an object. You can add any method you like to it, which is called instance methods which do have access to the individual doc
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString(); //ES6: access is the same as access: access 

    user.tokens.push({access, token}); //push new object to array, this is updating local user model, still need to save it

    return user.save().then(() => { //user.save() returns a promise. We will use this in server.js, and in order for us to chain on to the promise, we need to return it
        return token;
    });
};

UserSchema.statics.findByToken = function (token){ //everything you add on to 'UserSchema.statics' turns into a model method instead of an instance method like 'UserSchema.methods'
    var User = this;    // instance methods gets called with the individual document like 'generateAuthToken' function above, model methods gets called with the model as the this binding
    var decoded;

    try{
        decoded = jwt.verify(token, 'abc123');
    }catch(e){
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        //code above is same as below
        return Promise.reject();
    };

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function(next){
    var user = this;

    if(user.isModified('password')){
        var userPass = user.password;

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(userPass, salt, (err, hash) => {
                user.password = hash;
                // user.save();
                next(); //completing the middleware and saving the document, so no need for user.save()
            });
        });
        
    }else{
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};