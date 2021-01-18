import Router from "./server/Router";
import { dbInsert, dbSelect } from "./connectorDb";
import { InterfacePlayerSelector, InterfacePlayer } from "./interfaces";
import Route from "./server/Route";

const importDocs = (router: Router) => new Route(
    `/import`,
    ({ player }: {player: string}) => {
        return dbSelect(JSON.parse(player) as InterfacePlayerSelector).then((playersCollection: Array<InterfacePlayer>) => {
            console.log(`select /import`);
            router.playersDb = playersCollection;
            console.log(router.playersDb);
            
            return `Server successfully import players collection from DB...`;
        });
    },
);

const insertDoc = (router: Router) => new Route(
    `/add`,
    ({ player }: {player: string}) => {
        return dbInsert(JSON.parse(player)).then((playerInserted) => {
            router.playersDb.push(playerInserted as InterfacePlayer);
            return `Server successfully created player and flash it in the DB...`;
        });
    },
);

export { importDocs, insertDoc };