const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5a1c251df526230460d16e4c';
var userID = '5a1c293eb12ca7da5dd334d1';

if(!ObjectID.isValid(id)){
    console.log("ID not valid")
};

Todo.find({
    _id: id //mongoose does'nt require you to pass in object id's. Mongoose will convert this string we use into an object id and then it's gonna run the query
}).then((todos) => {
    console.log('Todos', todos);
});

Todo.findOne({
    _id: id //mongoose does not require you to pass in object id's. Mongoose will convert this string we use into an object id and then it's gonna run the query
}).then((todo) => {
    console.log('Todos', todo);
});

Todo.findById(id).then((todo) => {
    if(!todo){
        return console.log('Id not found');
    }
    console.log('Todo By ID', todo);
}).catch((e) => {
    console.log(e);
});

User.findById(userID).then((user) => {
    if(!user){
        console.log('No user found');
    }
    console.log('User by ID: ', user);
}).catch((e) => {
    console.log(e);
})