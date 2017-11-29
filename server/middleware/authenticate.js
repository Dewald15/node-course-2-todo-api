var {User} = require('./../models/user');

var authenticate = (req, res, next) => { //the actual route will not run until next gets called inside of the middleware
    var token = req.header('x-auth');
    
    User.findByToken(token).then((user) => {
        if(!user){
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = {
    authenticate
}