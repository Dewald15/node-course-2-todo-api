var env = process.env.NODE_ENV || 'development'; //if we are on production, 'process.env.NODE_ENV ' will be set. If we are on test, 'process.env.NODE_ENV ' will be set. If we are on developement, ''development will be used.

if(env === 'development' || env === 'test'){
    var config = require('./config.json');//when you require a json file, it automatically pasrses it into a js object 
    var envConfig = config[env];
    Object.keys(envConfig).forEach((key) => { //Object.keys() takes an object and gets all of the keys and returns them as an array
        process.env[key] = envConfig[key];
    }) 
}

// if(env === 'development'){ //port will be set locally for development
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'; //setting a mongodb URI environment variable which is the exast same name for the variable we have in production in mongoose.js
// }else if(env === 'test'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }