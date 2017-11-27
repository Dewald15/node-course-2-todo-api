//server.js will only be responsible for our routes
//lib imports
var express = require('express');
var bodyParser = require('body-parser'); //takes json and convert it to an object attaching it on the request object in post

//local imports
var {mongoose} = require('./db/mongoose'); //this syntax is same as 'var mongoose = require('./db/mongoose').mongoose;'
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {ObjectID} = require('mongodb');

var app = express();

app.use(bodyParser.json()); //app.use takes the middleware. If were writing custom middleware it will take the function, if we use 3rd party middleware, we can access it from its lib

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
    }

    Todo.findById(id).then((todo) => {
        if(todo){
            res.send({todo}); //send back object as todo property, called the es6 object definition, same as 'todo: todo'. This gives a little flexibility down the line like adding other properties to the response  
        }else{
            return res.status(404).send();
        }
    }).catch((e) => {
        return res.status(400).send();
    })
})

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {
    app
};
