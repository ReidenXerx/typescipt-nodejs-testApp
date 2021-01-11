import { response } from "express";
import { get } from "http";
import { Document } from "mongoose";
import { format, parse } from "url";
import Player from "./classes/Player";
import { dbInsert, dbSelect } from "./connectorDb";
import { InterfacePlayer, InterfacePlayerDocument, InterfacePlayerSelector } from "./inerfaces";
import Route from "./server/Route";
import Router from "./server/Router";

export const PORT = 1337;

//$ оптимизированная работа с базой, точечное редактирование

const router: Router = new Router();
router.startServer();
const requestAdd = parse(format({
    protocol: 'http',
    hostname: 'localhost',
    pathname: '/add',
    port: PORT,
    query: {
        player: JSON.stringify({
            name: 'Mihail',
            secondName: 'Giant',
            team: 'teamless',
            birthday: new Date('10.05.1995'),
            online: true,
        } as InterfacePlayer)
    },
}));

const requestUpdate = parse(format({
    protocol: 'http',
    hostname: 'localhost',
    pathname: '/updatePlayers',
    port: PORT,
    query: {
        playerUpdate: JSON.stringify(
            {
                birthday: new Date('10.06.2001'),
            } as InterfacePlayerSelector,
        ),
        selector: JSON.stringify(
            {
                name: `Mihail`,
                secondName: `Giant`,
            } as InterfacePlayerSelector,
        ),
    },
}));

const requestImport = parse(format({
    protocol: 'http',
    hostname: 'localhost',
    pathname: '/import',
    port: PORT,
    query: {
        player: JSON.stringify(
            {} as InterfacePlayerSelector,
        ),
    },
}));

router.addRoute(new Route(
    `/add`,
    ({ player }: {player: string}) => {
        dbInsert(JSON.parse(player)).then((playerInserted: InterfacePlayerDocument) => {
            router.playersDb.push(playerInserted);
            return `Server successfully created player and flash it in the DB...`;
        });
    },
));

//реализация интерфейса работы с объектом локальной коллекции через миддлвар
//создать метки для обновления/записи в бд
//*проблема с заменой локальных игроков, на игроков из базы при слиянии

router.addRoute(new Route(
    `/updatePlayers`,
    ({ playerUpdate, selector }: { playerUpdate: string, selector: string }) => {
        //console.log(`online ${router.playersDb[1].online}`);
        const playerUpdateObject: InterfacePlayerSelector = JSON.parse(playerUpdate);
        const selectorObject: InterfacePlayerSelector = JSON.parse(selector);
        //console.log(`playerUpdate`);
        //console.log(playerUpdateObject);
        
        //console.log(`selector`);
        //console.log(selectorObject);
        
        
        router.playersDb[1].online = true;
        router.playersDb[1].save();

        const indexes: Array<number> = [];
        const needed: number = Object.keys(selectorObject).length;

        router.playersDb.filter((player, index) => {
            let indexer: number = 0;
            Object.keys(selectorObject).forEach((selectorKey: keyof InterfacePlayer | string) => {
                if (selectorObject[selectorKey as keyof InterfacePlayer] === player[selectorKey as keyof InterfacePlayer]) {
                    indexer++;
                }
            });
            if (indexer === needed) {
                indexes.push(index);
            }
        });

        router.playersDb[1]['online']
        const updateKeys: Array<string> = Object.keys(playerUpdateObject);
        //console.log(indexes);
        
        indexes.forEach((index: number) => {
            updateKeys.forEach((updateKey) => {
                router.playersDb[index][updateKey as keyof InterfacePlayerSelector] = playerUpdateObject[updateKey as keyof InterfacePlayerSelector] as Boolean & string & Date;
            });
            router.playersDb[index].save();
        });
        return `Server successfully updated selected players in DB...`;
    }
));

router.addRoute(new Route(
    `/import`,
    ({ player }: {player: string}) => {
        return dbSelect(JSON.parse(player)).then((playersCollection: Array<InterfacePlayerDocument>) => {
            console.log(`select /import`);
            
            router.playersDb = playersCollection;
            //console.log(router.playersDb);
            
            return `Server successfully import players collection from DB...`;
        });
    },
));

router.addRoute(new Route(
    `/reload`,
    ({ player }: {player: string}) => {
        return dbSelect(JSON.parse(player) as InterfacePlayerSelector).then((playersCollection: Array<InterfacePlayerDocument>) => {
            router.playersDb = [];
            router.playersDb = playersCollection;
            return `Server successfully reloaded players collection from DB...`;
        });
    },
));

// (async () => {
//     get({
//         hostname: requestImport.hostname,
//         port: requestImport.port,
//         path: requestImport.path,
//     }, async (res) => {
//         await res.on('data', (response) => {
//             const data = JSON.parse(response);
//             console.log(`Got from server after import`);
//             console.log(data);
            
//         })
//     })
//     await get({
//         hostname: requestUpdate.hostname,
//         port: requestUpdate.port,
//         path: requestUpdate.path,
//     }, async (res) => {
//         await res.on('data', (response) => {
//             const data = JSON.parse(response);
//             console.log(`Got from server`);
//             //console.log(data);
            
//         })
//     })

//     setTimeout(
//         () => {
//             dbSelect().then((collection) => {
//                 //console.log(collection);
//             });
//         }, 1000);
// })().then()

( () => {
        get({
            hostname: requestImport.hostname,
            port: requestImport.port,
            path: requestImport.path,
        }, async (res) => {
            await res.on('data', (response) => {
                const data = JSON.parse(response);
                console.log(`Got from server after import`);
                console.log(data);
                
            })

            get({
                hostname: requestUpdate.hostname,
                port: requestUpdate.port,
                path: requestUpdate.path,
            }, async (res) => {
                await res.on('data', (response) => {
                    const data = JSON.parse(response);
                    console.log(`Got from server`);
                    //console.log(data);
                    
                })
            })
        })
    
        setTimeout(
            () => {
                dbSelect().then((collection) => {
                    //console.log(collection);
                });
            }, 1000);
    })()


// get({
//     hostname: requestAdd.hostname,
//     port: requestAdd.port,
//     path: requestAdd.path,
// }, async (res) => {
//     await res.on('data', (response) => {
//         const data = JSON.parse(response);
//         console.log(`Got from server`);
//         console.log(data);
        
//     })
// });


