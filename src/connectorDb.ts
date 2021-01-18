/*import * as mssql from 'mssql/msnodesqlv8';
import sql from 'mssql/msnodesqlv8';
import { config } from 'mssql/msnodesqlv8';

export const connect = async () => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        const pool = new mssql.ConnectionPool(
            {
                user: `dbo`,
                password: 'Pfqxbr128',
                domain: 'localhost',
                server: 'localhost',
                database: 'FOOTBALL_PLAYERS',
                driver: "msnodesqlv8",
                options: {
                    trustedConnection: true,
                    useUTC: true,
                }
            } as config
        );
        await pool.connect().then(async () => {
            const request = new sql.Request(pool);
            const result = await request.query(`select * from Players`);
            console.dir(result);
        })
    } catch (err) {
        // ... error checks
        console.log(err);
        
    }
};
*/

import mongodb, { MongoClient } from 'mongodb';
import { Document as DocumentType, CallbackError} from 'mongoose';
import { rejects } from "assert";
import { InterfacePlayer, InterfacePlayerSelector } from './interfaces';
import Player from './classes/Player';

const url = 'mongodb://localhost:27017/FOOTBALL_PLAYERS';

const mongoClient = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
console.log(`log`);

mongoClient.connect(() => {
    console.log(`connected to database`);
});

const dbSelect = (player: InterfacePlayerSelector = {}) => new Promise<Array<InterfacePlayer>>((resolve, reject) => {
    const db = mongoClient.db("FOOTBALL_PLAYERS");
    const collection = db.collection("players");
     
    collection.find().toArray(function(err, results: Array<InterfacePlayer>){
                 
        resolve(results);
        //mongoClient.close();
    });
});


const dbInsert = (players: Array<InterfacePlayer>) => new Promise((resolve, reject) => {
    const db = mongoClient.db("FOOTBALL_PLAYERS");
    const collection = db.collection("players");
     
    collection.insertMany(players, function(err, results){
                 
        resolve(results);
        mongoClient.close();
    });
});

const dbUpdate = (playerSelector: InterfacePlayerSelector, playerUpdate: InterfacePlayer) => new Promise((resolve, reject) => {
    const db = mongoClient.db("FOOTBALL_PLAYERS");
    const collection = db.collection("players");
     
    collection.updateOne(playerSelector, playerUpdate).then((result) => {
        resolve(result);
    });
});

export { dbSelect, dbInsert, dbUpdate };