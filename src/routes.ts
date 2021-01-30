import Router from "./server/Router";
import { dbInsert, dbSelect } from "./connectorDb";
import { InterfacePlayerSelector, InterfacePlayer } from "./interfaces";
import Route from "./server/Route";

const importDocs = (router: Router) => new Route(
    `/import`,
    ({ player }: {player: string}) => {
        console.log('import - routes');
        
        return dbSelect(JSON.parse(player) as InterfacePlayerSelector).then((playersCollection: Array<InterfacePlayer>) => {
            console.log(`select /import`);
            router.playersDb = playersCollection;
            console.log(router.playersDb);
            
            return `Server successfully import players collection from DB...`;
        });
    },
);

const insertDocs = (router: Router) => new Route(
    `/insert`,
    (array: string) => {
        console.log(array);
        
        const playersArray = JSON.parse(array);
        return dbInsert(playersArray as Array<InterfacePlayer>).then((playerInserted) => {
            router.playersDb.push(playerInserted as InterfacePlayer);
            return `Server successfully created player and flash it in the DB...`;
        });
    },
);

export { importDocs, insertDocs };