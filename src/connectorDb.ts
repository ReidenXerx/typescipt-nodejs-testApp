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

import mongoose from 'mongoose';
import { Document as DocumentType, CallbackError} from 'mongoose';
import { rejects } from "assert";
import { InterfacePlayer } from './inerfaces';
import Player from './classes/Player';

const mockDB: Array<Player> = [];

mockDB.push(new Player(
    'Alisson',
    'Bekker',
    'Liverpool',
    new Date('10.02.1985'),
    true,
).setId('1'));

mockDB.push(new Player(
    'Sadio',
    'Mane',
    'Liverpool',
    new Date('15.03.1995'),
    true,
).setId('2'));

mockDB.push(new Player(
    'Raynor',
    'John',
    'Starcraft',
    new Date('20.08.2085'),
    true,
).setId('1'));

export default mockDB;

mongoose.connect('mongodb://localhost:27017/FOOTBALL_PLAYERS', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => {
    console.log(`connected to database`);
})

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    secondName: {
        type: String,
        required: true,
    },
    team: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    online: {
        type: Boolean,
        required: true,
    },
});

const playerModel = mongoose.model('Players', playerSchema);

const dbInsert = (player: InterfacePlayer) => {
    return new Promise<DocumentType<InterfacePlayer>>((resolve, reject) => {
        playerModel.create(
            player, (err: mongoose.CallbackError, doc: DocumentType<InterfacePlayer>) => {
                console.log(`creating...`);
                
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(doc);
                    console.log(`saved`);
                    resolve(doc);
                }
            }
        )
    });
}

const dbSelect = (selector: Object = {}) => {
    return new Promise<Array<DocumentType<InterfacePlayer>>>((resolve, reject) => {
        playerModel.find(selector, (err, docs: Array<mongoose.Document<InterfacePlayer>>) => {
            if (err) {
                console.log(`Something went wrong...`);
                console.log(err);
                reject(err);
            } else {
                console.log(`Successfully got from server...`);
                docs.filter((doc) => console.log(doc));
                resolve(docs);
            }
        })
    });
}

export { dbInsert, dbSelect };