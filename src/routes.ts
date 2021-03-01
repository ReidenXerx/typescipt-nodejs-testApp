/* eslint-disable no-console */
import Router from './server/Router';
import { dbInsert, dbSelect } from './connectorDb';
import { InterfacePlayerSelector, InterfacePlayer, TransferDataWrapper } from './interfaces';
import Route from './server/Route';

const importDocs = (router: Router) => new Route(
    '/import',
    ({ objectData: filterPlayer } : TransferDataWrapper) => new Promise((resolve, reject) => {
        if (filterPlayer) {
            //let bullshit = JSON.parse("{'nigger': 'niggerskii'}" as any); 
            console.log('import processing...');
            dbSelect(/*JSON.parse(filterPlayer) as InterfacePlayerSelector*/{}).then((playersCollection: Array<InterfacePlayer>) => {
                router.playersDb = playersCollection;
                console.log('db select passed', playersCollection); // сюда не заходит
                resolve(
                    {
                        objectData: '',
                        statusText: 'Server successfully import players collection from DB...',
                    } as TransferDataWrapper,
                );
            }).catch((error) => {
                console.log(error, 'error');
                // eslint-disable-next-line prefer-promise-reject-errors
                reject(
                    {
                        objectData: '',
                        statusText: error.message,
                    } as TransferDataWrapper,
                );
            });
        }
    }),
);

const insertDocs = (router: Router) => new Route(
    '/insert',
    ({ objectData: arrayForInsert } : TransferDataWrapper) => new Promise((resolve, reject) => {
        let playersArray = [];
        playersArray = JSON.parse(arrayForInsert);
        dbInsert(playersArray as Array<InterfacePlayer>).then((playerInserted) => {
            router.playersDb.push(playerInserted as InterfacePlayer);
            resolve(
                {
                    objectData: '',
                    statusText: 'Server successfully created player and flash it in the DB...',
                } as TransferDataWrapper,
            );
        }).catch((error: Error) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(
                {
                    objectData: '',
                    statusText: error.message,
                } as TransferDataWrapper,
            );
        });
    }),
);

export { importDocs, insertDocs };
