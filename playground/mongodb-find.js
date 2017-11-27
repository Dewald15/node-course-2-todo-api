const {MongoClient, ObjectID} = require('mongodb'); //mongoclient lets you connect to a mongo server and issue commands to manipulate the database

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => { //takes two arguments, the 1st arg is a string url where your database lives. 2nd arg is a callback function which will fire after the connection has succeeded or failed. Also, we dont have to specify an existing database name, it will create one if there isnt one with that name.
    if(err){
        return console.log('Unable to connect to MongoDB server');//return is only stated so that the function can stop if there's an error
    }
    console.log('Connected to MongoDB server');

    // //find returning array
    db.collection('Users').find({
        _id: new ObjectID('5a1bc3a02272391d08ab4070')
    }).toArray().then((docs) => { //if find has no arguments, it will return all collections in specified document
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch Users', err)
    });

    // counting 
    db.collection('Users').find().count().then((docs) => { //if find has no arguments, it will return all collections in specified document
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch Users', err)
    });

    //Delete
    //==============================================================================================
    //deleteMany
    db.collection('Users').deleteMany({
        text: 'Walk the dog'
    }).then((result) => {
        console.log(result);
    });
    //deleteOne is the same as deleteMany, except it deletes only the fir
    //findOneAndDelete

    //Update
    //==============================================================================================

    //findOneAndUpdate
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a1bc6d6f0f91057543e1fda')
    }, { $set:{
        age: 28
    }}, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    db.close();
}); 