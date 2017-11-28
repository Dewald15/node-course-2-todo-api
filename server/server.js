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

var app = express();
const port = process.env.PORT; //PORT will be set if the app is running on heroku for production

app.use(bodyParser.json()); //app.use takes the middleware. If we're writing custom middleware it will take the function, if we use 3rd party middleware, we can access it from its lib

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
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

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    };

    Todo.findById(id).then((todo) => {
        if(todo){
            res.send({todo}); //send back object as todo property, called the es6 object definition, same as 'todo: todo'. This gives a little flexibility down the line like adding other properties to the response  
        }else{
            return res.status(404).send();
        }
    }).catch((e) => {
        return res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }

        res.send({todo});

    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {$set:body}, {new: true}).then((todo) => { //body is var arr above
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};
