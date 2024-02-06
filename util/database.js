const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;


const mongoConnect = (callback) => {
    MongoClient.connect("mongodb+srv://Mike:T0wtSsPws1dOPuFL@cluster.8oboqne.mongodb.net/")
        .then(client => {
            console.log("Connected!");
            callback(client);
        })
        .catch(err => {
            console.log(err);
        });
};


module.exports = mongoConnect;
