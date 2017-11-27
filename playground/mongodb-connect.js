const MongoClient = require('mongodb').MongoClient; //mongoclient lets you connect to a mongo server and issue commands to manipulate the database

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => { //takes two arguments, the 1st arg is a string url where your database lives. 2nd arg is a callback function which will fire after the connection has succeeded or failed. Also, we dont have to specify an existing database name, it will create one if there isnt one with that name.
    if(err){
        return console.log('Unable to connect to MongoDB server');//return is only stated so that the function can stop if there's an error
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({ //db object where we can issue commands to read and write data
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert Todos', err);
    //     }
        
    //     console.log(JSON.stringify(result.ops, undefined, 2)); //ops will store all the docs that were inserted
    // });

    db.collection('Users').insertOne({ //db object where we can issue commands to read and write data
        name: 'Dee VDB',
        age: 25,
        location: 'Sandton. Gauteng, South Africa'
    }, (err, result) => {
        if(err){
            return console.log('Unable to insert into Users', err);
        }
        
        console.log(JSON.stringify(result.ops[0].name, undefined, 2)); //ops will store all the docs that were inserted
    });

    db.close();
}); 