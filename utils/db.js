const { MongoClient, ObjectId } = require('mongodb');

process.env.MONGODB_URI = 'mongodb://erisecho1:68ija27nDJ7uVP4bItjwcoEY7B686GTgqEPO1oJWnKnFg70ZdcGlUGKPZU2Iu41TrhiNGnRMAenoACDbu9YH4g%3D%3D@erisecho1.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@erisecho1@';

if (!process.env.MONGODB_URI) {
    // throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    process.env.MONGODB_URI = 'mongodb://localhost:27017';
}

// Connect to MongoDB
async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('bookingsDB');
    db.client = client;
    return db;
}

module.exports = { connectToDB, ObjectId };