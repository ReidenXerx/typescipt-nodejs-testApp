/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-console */
import Router from './server/Router';
import { dbInsert, dbSelect } from './connectorDb';
import { InterfacePlayerSelector, InterfacePlayer, TransferDataWrapper, BatchSubRequest } from './interfaces';
import Route from './server/Route';
import RouteBatch from './classes/RouteBatch';

const importDocs = () => new Route(
    '/import',
    ({ objectData: filterPlayer } : TransferDataWrapper, lastRequestData: string) => new Promise((resolve, reject) => {
        if (filterPlayer) {
            console.log('import processing...');
            if (filterPlayer !== lastRequestData) {
                dbSelect(/*JSON.parse(filterPlayer) as InterfacePlayerSelector*/{}).then((playersCollection: Array<InterfacePlayer>) => {
                    resolve(
                        {
                            objectData: JSON.stringify(playersCollection),
                            statusText: 'Server successfully import players collection from DB...',
                        } as TransferDataWrapper,
                    );
                }).catch((error) => {
                    reject(
                        {
                            objectData: JSON.stringify(error),
                            statusText: 'Sorry, something went wrong',
                            lastRequestData: filterPlayer,
                        } as TransferDataWrapper,
                    );
                });
            } else {
                reject(
                    {
                        objectData: '',
                        statusText: 'Duplicate request. Goodbye. Cancelling...',
                    } as TransferDataWrapper,
                );
            }
        }
    }),
);

const insertDocs = () => new Route(
    '/insert',
    ({ objectData: arrayForInsert } : TransferDataWrapper, lastRequestData: string) => new Promise((resolve, reject) => {
        if (arrayForInsert !== lastRequestData) {
            let playersArray = [];
            playersArray = JSON.parse(arrayForInsert);
            dbInsert(playersArray as Array<InterfacePlayer>).then((playerInserted) => {
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
                        lastRequestData: arrayForInsert,
                    } as TransferDataWrapper,
                );
            });
        } else {
            reject(
                {
                    objectData: '',
                    statusText: 'Duplicate request. Goodbye. Cancelling...',
                } as TransferDataWrapper,
            );
        }
    }),
);

const batchRequest = (restrictedRoutes: Array<Route>) => new RouteBatch(
    '/batch',
    ({ objectData: stringBatchSubRequests } : TransferDataWrapper, lastRequestData: string) => new Promise((resolve, reject) => {
        if (stringBatchSubRequests !== lastRequestData) {
            let arrayBatchSubRequests: Array<BatchSubRequest> = [];
            arrayBatchSubRequests = JSON.parse(stringBatchSubRequests);
            const batchSubRequestQueue: Array<Promise<any>> = [];
            const batchSubRequestQueueNames: Array<string> = [];
            const batchSubRequestQueueResults: Array<TransferDataWrapper> = [];
            arrayBatchSubRequests.forEach((batchSubRequest: BatchSubRequest) => {
                restrictedRoutes.forEach((restrictedRoute: Route) => {
                    if (restrictedRoute.Path === batchSubRequest.path) {
                        batchSubRequestQueue.push(restrictedRoute.engage(
                            {
                                objectData: batchSubRequest.payload,
                                statusText: '',
                            } as TransferDataWrapper,
                        ));
                        batchSubRequestQueueNames.push(batchSubRequest.path);
                    }
                });
            });

            Promise.all(batchSubRequestQueue).then((results) => {
                batchSubRequestQueueResults.concat(results);
            });

            resolve(
                {
                    objectData: batchSubRequestQueueResults.join(),
                    statusText: 'Server successfully completed batch request',
                } as TransferDataWrapper,
            )
        } else {
            reject(
                {
                    objectData: '',
                    statusText: 'Duplicate request. Goodbye. Cancelling...',
                } as TransferDataWrapper,
            );
        }
    }),
    restrictedRoutes,
);

export { importDocs, insertDocs };
