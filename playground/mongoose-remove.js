const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => { //do not get the docs back which was removed, only the num of docs removed
//     console.log(result);
// });

//Todo.findOneAndRemove() //it will also return the doc object so you can do something with the returned data
//Todo.findByIdAndRemove() //will also return doc

// Todo.findByIdAndRemove("5a1d3b09e0bf781b7fbc45cd").then((todo) => {
//     console.log(todo);
// });

// Todo.findOneAndRemove({_id: '5a1d3b09e0bf781b7fbc45cd'}).then((todo) => { //can query with not just only the id
    
// });