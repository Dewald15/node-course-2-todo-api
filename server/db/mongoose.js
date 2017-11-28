var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
// mongoose.connect('mongodb://localhost:27017/TodoApp'); //there is no callback with mongoose. Mongoose takes care of async ops as this connection will take a few mil secs to finish

module.exports = {
    mongoose
}
