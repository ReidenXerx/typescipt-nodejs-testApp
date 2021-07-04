"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbUpdate = exports.dbInsert = exports.dbSelect = void 0;
const mongodb_1 = require("mongodb");
// const url = `mongodb://localhost:27017/FOOTBALL_PLAYERS`;
const url = `mongodb://${process.env.MONGO}/FOOTBALL_PLAYERS`;
const mongoClient = new mongodb_1.MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoClient.connect(() => {
    console.log('connected to database');
});
const dbSelect = (player = {}) => new Promise((resolve, reject) => {
    const db = mongoClient.db('FOOTBALL_PLAYERS');
    const collection = db.collection('players');
    collection.find(player).toArray((err, results) => {
        console.log('err', err);
        resolve(results);
    });
});
exports.dbSelect = dbSelect;
const dbInsert = (players) => new Promise((resolve, reject) => {
    const db = mongoClient.db('FOOTBALL_PLAYERS');
    const collection = db.collection('players');
    collection.insertMany(players, (err, results) => {
        resolve(results);
        mongoClient.close();
    });
});
exports.dbInsert = dbInsert;
const dbUpdate = (playerSelector, playerUpdate) => new Promise((resolve, reject) => {
    const db = mongoClient.db('FOOTBALL_PLAYERS');
    const collection = db.collection('players');
    collection.updateOne(playerSelector, playerUpdate).then((result) => {
        resolve(result);
    });
});
exports.dbUpdate = dbUpdate;
