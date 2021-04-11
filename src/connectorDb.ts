import mongodb, { MongoClient } from 'mongodb';
import { InterfacePlayer, InterfacePlayerSelector } from './interfaces';

const url = 'mongodb://localhost:27017/FOOTBALL_PLAYERS';

const mongoClient = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoClient.connect(() => {
    console.log('connected to database');
});

const dbSelect = (player: InterfacePlayerSelector = {}) => new Promise<Array<InterfacePlayer>>((resolve, reject) => {
    const db = mongoClient.db('FOOTBALL_PLAYERS');
    const collection = db.collection('players');
    collection.find(player).toArray((err, results: Array<InterfacePlayer>) => {
        resolve(results);
    });
});

const dbInsert = (players: Array<InterfacePlayer>) => new Promise((resolve, reject) => {
    const db = mongoClient.db('FOOTBALL_PLAYERS');
    const collection = db.collection('players');

    collection.insertMany(players, (err, results) => {
        resolve(results);
        mongoClient.close();
    });
});

const dbUpdate = (playerSelector: InterfacePlayerSelector, playerUpdate: InterfacePlayer) => new Promise((resolve, reject) => {
    const db = mongoClient.db('FOOTBALL_PLAYERS');
    const collection = db.collection('players');

    collection.updateOne(playerSelector, playerUpdate).then((result) => {
        resolve(result);
    });
});

export { dbSelect, dbInsert, dbUpdate };
