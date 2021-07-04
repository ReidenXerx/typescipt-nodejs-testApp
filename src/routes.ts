
/* eslint-disable no-console */

import { parse } from 'url';
import { dbInsert, dbSelect } from './connectorDb';
import {
    InterfacePlayerSelector,
    InterfacePlayer,
    TransferDataWrapper,
    BatchSubRequest,
    BatchSubRequestResult,
    BatchSubRequestQueueTask,
} from './interfaces';
import Route from './server/Route';
import RouteBatch from './classes/RouteBatch';

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
                    console.log('error', error);
                    
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject(
                        {
                            objectData: JSON.stringify(error),
                            statusText: 'Sorry, something went wrong',
                            lastRequestData: filterPlayer,
                        } as TransferDataWrapper,
                    );
                });
            } else {
                // eslint-disable-next-line prefer-promise-reject-errors
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
                        objectData: JSON.stringify(playerInserted),
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
            // eslint-disable-next-line prefer-promise-reject-errors
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
            const batchSubRequestQueue: Array<BatchSubRequestQueueTask> = [];
            const batchSubRequestQueueResults: Array<BatchSubRequestResult> = [];

            console.log('stringBatchSubRequests', stringBatchSubRequests);
            try {
                arrayBatchSubRequests = JSON.parse(stringBatchSubRequests);
            } catch (error) {
                console.log(error);
            }
            console.log('arrayBatchSubRequests', arrayBatchSubRequests);

            arrayBatchSubRequests = arrayBatchSubRequests.map((batchSubRequest: BatchSubRequest) => {
                console.log('batchSubRequest', batchSubRequest);
                const batchSubRequestCopy = batchSubRequest;
                // convert from get request
                if (!batchSubRequest.payload) {
                    batchSubRequestCopy.payload = JSON.stringify(parse(batchSubRequest.path, true).query);
                    batchSubRequestCopy.path = parse(batchSubRequest.path, true).pathname!;
                }
                restrictedRoutes.forEach((restrictedRoute: Route) => {
                    if (restrictedRoute.Path === batchSubRequestCopy.path) {
                        batchSubRequestQueue.push(
                            {
                                pathName: batchSubRequestCopy.path,
                                task: restrictedRoute.engage(
                                    {
                                        objectData: batchSubRequestCopy.payload,
                                        statusText: '',
                                    } as TransferDataWrapper,
                                ),
                            },
                        );
                    }
                });
                return batchSubRequestCopy;
            });

            Promise.allSettled(batchSubRequestQueue.map((batchSubRequest) => batchSubRequest.task)).then((results) => {
                results.forEach((batchSubRequestResultedArray, index) => {
                    if (batchSubRequestResultedArray.status === 'fulfilled') {
                        batchSubRequestQueueResults.push(
                            {
                                pathName: batchSubRequestQueue[index].pathName,
                                statusText: 'Congratulations, your request was succeed',
                                result: JSON.stringify(batchSubRequestResultedArray.value),
                            } as BatchSubRequestResult,
                        );
                    } else { // rejected
                        batchSubRequestQueueResults.push(
                            {
                                pathName: batchSubRequestQueue[index].pathName,
                                statusText: 'Your request rejected',
                                reason: JSON.stringify(batchSubRequestResultedArray.reason),
                            } as BatchSubRequestResult,
                        );
                    }
                    // add else with errors
                });
                resolve(
                    {
                        objectData: JSON.stringify(batchSubRequestQueueResults),
                        statusText: 'Server successfully completed batch request',
                    } as TransferDataWrapper,
                );
            });
        } else {
            // eslint-disable-next-line prefer-promise-reject-errors
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
