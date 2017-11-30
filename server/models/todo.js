var mongoose = require("mongoose");

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true //**removes any leading and trailing spaces
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

// var newTodo = new Todo({
//     text: "Cook dinner"
// });

// var newTodo = new Todo({
//     text: "Do planning",
//     completed: false,
//     completedAt: 5
// });

// newTodo.save().then((doc) => {
//     console.log('Saved Todo', doc);
// }, (e) => {
//     console.log('Unable to save Todo', e);
// });

module.exports = {
    Todo
};