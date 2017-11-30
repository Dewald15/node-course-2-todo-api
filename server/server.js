//server.js will only be responsible for our routes
//lib imports
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser'); //takes json and convert it to an object attaching it on the request object in post
const {ObjectID} = require('mongodb');

//local imports
var {mongoose} = require('./db/mongoose'); //this syntax is same as 'var mongoose = require('./db/mongoose').mongoose;'
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT; //PORT will be set if the app is running on heroku for production

app.use(bodyParser.json()); //app.use takes the middleware. If we're writing custom middleware it will take the function, if we use 3rd party middleware, we can access it from its lib

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos})
    }, (e) => {
        res.status(400).send(e);
    });
});

// app.get('/users', (req, res) => {
//     Todo.find().then((users) => {
//         res.send({users})
//     }, (e) => {
//         res.status(400).send(e);
//     });
// });

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    };

    Todo.findOne({
        _id: id, 
        _creator: req.user._id
    }).then((todo) => {
        if(todo){
            res.send({todo}); //send back object as todo property, called the es6 object definition, same as 'todo: todo'. This gives a little flexibility down the line like adding other properties to the response  
        }else{
            return res.status(404).send();
        }
    }).catch((e) => {
        return res.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }

        res.send({todo});

    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); //this is a subset of the things the user passed to us, we dont want the user to update anything they choose

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set:body}, {new: true}).then((todo) => { //body is var arr above
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']); //1st argument: object we want to pick from, 2nd argument is an array of properties we want to pick of
    var user = new User(body);

    // User    //model method
    // user    //instance methods

    user.save().then(() => {    //save() will attempt to save the document to the database
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user); // 'x-' means you are creating a custom header, hwich means it's not a header http supports by default, it's a heading you are using for specific purposes
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user); // response will only be the _id and the email, see 'toJSON' method in user.js
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((err) => {
        res.status(400).send();
    })
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};
