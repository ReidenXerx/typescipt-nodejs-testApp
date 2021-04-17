
/* eslint-disable no-console */
import Router from './server/Router';
import { dbInsert, dbSelect } from './connectorDb';
import { InterfacePlayerSelector, InterfacePlayer, TransferDataWrapper, BatchSubRequest, batchSubRequestResult, batchSubRequestQueueTask } from './interfaces';
import Route from './server/Route';
import RouteBatch from './classes/RouteBatch';
import { parse } from 'url';

const importDocs = () => new Route(
    '/import',
    ({ objectData: filterPlayer } : TransferDataWrapper, lastRequestData: string) => new Promise((resolve, reject) => {
        if (filterPlayer) {
            console.log('import processing...');
            
            if (filterPlayer !== lastRequestData) {
                dbSelect(JSON.parse(filterPlayer) as InterfacePlayerSelector).then((playersCollection: Array<InterfacePlayer>) => {
                    
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
            const batchSubRequestQueue: Array<batchSubRequestQueueTask> = [];
            const batchSubRequestQueueResults: Array<batchSubRequestResult> = [];

            console.log('stringBatchSubRequests', stringBatchSubRequests);
            try {
                arrayBatchSubRequests = JSON.parse(stringBatchSubRequests);
            } catch (error) {
                console.log(error);
                
            }
            console.log('arrayBatchSubRequests', arrayBatchSubRequests);

            arrayBatchSubRequests.forEach((batchSubRequest: BatchSubRequest) => {
                console.log('batchSubRequest', batchSubRequest);
                
                // convert from get request
                if (!batchSubRequest.payload) {
                    batchSubRequest.payload = JSON.stringify(parse(batchSubRequest.path, true).query);
                    batchSubRequest.path = parse(batchSubRequest.path, true).pathname!;
                }
                
                restrictedRoutes.forEach((restrictedRoute: Route) => {
                    
                    if (restrictedRoute.Path === batchSubRequest.path) {
                        batchSubRequestQueue.push(
                            {
                                pathName: batchSubRequest.path,
                                task: restrictedRoute.engage(
                                {
                                    objectData: batchSubRequest.payload,
                                    statusText: '',
                                } as TransferDataWrapper)
                            }
                        );
                    }
                });
            });

            Promise.allSettled(batchSubRequestQueue.map((batchSubRequest) => {
                return batchSubRequest.task;
            })).then((results) => {
                results.forEach((batchSubRequestResult, index) => {
                    if (batchSubRequestResult.status === 'fulfilled') {
                        
                        batchSubRequestQueueResults.push(
                            {
                                pathName: batchSubRequestQueue[index].pathName,
                                statusText: 'Congratulations, your request was succeed',
                                result: JSON.stringify(batchSubRequestResult.value),
                            } as batchSubRequestResult
                        )
                    } else { // rejected
                        batchSubRequestQueueResults.push(
                            {
                                pathName: batchSubRequestQueue[index].pathName,
                                statusText: 'Your request rejected',
                                reason: JSON.stringify(batchSubRequestResult.reason),
                            } as batchSubRequestResult
                        )
                    }
                    // add else with errors
                });
                
                resolve(
                    {
                        objectData: JSON.stringify(batchSubRequestQueueResults),
                        statusText: 'Server successfully completed batch request',
                    } as TransferDataWrapper,
                )
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
    restrictedRoutes,
);

export { importDocs, insertDocs, batchRequest };
