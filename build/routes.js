"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchRequest = exports.insertDocs = exports.importDocs = void 0;
/* eslint-disable no-console */
/*eslint-disable */
const url_1 = require("url");
const connectorDb_1 = require("./connectorDb");
const Route_1 = __importDefault(require("./server/Route"));
const RouteBatch_1 = __importDefault(require("./classes/RouteBatch"));
const importDocs = () => new Route_1.default('/import', ({ objectData: filterPlayer }, lastRequestData) => new Promise((resolve, reject) => {
    if (filterPlayer) {
        console.log('import processing...');
        if (filterPlayer !== lastRequestData) {
            connectorDb_1.dbSelect(JSON.parse(filterPlayer)).then((playersCollection) => {
                resolve({
                    objectData: JSON.stringify(playersCollection),
                    statusText: 'Server successfully import players collection from DB...',
                });
            }).catch((error) => {
                reject({
                    objectData: JSON.stringify(error),
                    statusText: 'Sorry, something went wrong',
                    lastRequestData: filterPlayer,
                });
            });
        }
        else {
            reject({
                objectData: '',
                statusText: 'Duplicate request. Goodbye. Cancelling...',
            });
        }
    }
}));
exports.importDocs = importDocs;
const insertDocs = () => new Route_1.default('/insert', ({ objectData: arrayForInsert }, lastRequestData) => new Promise((resolve, reject) => {
    if (arrayForInsert !== lastRequestData) {
        let playersArray = [];
        playersArray = JSON.parse(arrayForInsert);
        connectorDb_1.dbInsert(playersArray).then((playerInserted) => {
            resolve({
                objectData: '',
                statusText: 'Server successfully created player and flash it in the DB...',
            });
        }).catch((error) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
                objectData: '',
                statusText: error.message,
                lastRequestData: arrayForInsert,
            });
        });
    }
    else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
            objectData: '',
            statusText: 'Duplicate request. Goodbye. Cancelling...',
        });
    }
}));
exports.insertDocs = insertDocs;
const batchRequest = (restrictedRoutes) => new RouteBatch_1.default('/batch', ({ objectData: stringBatchSubRequests }, lastRequestData) => new Promise((resolve, reject) => {
    if (stringBatchSubRequests !== lastRequestData) {
        let arrayBatchSubRequests = [];
        const batchSubRequestQueue = [];
        const batchSubRequestQueueResults = [];
        console.log('stringBatchSubRequests', stringBatchSubRequests);
        try {
            arrayBatchSubRequests = JSON.parse(stringBatchSubRequests);
        }
        catch (error) {
            console.log(error);
        }
        console.log('arrayBatchSubRequests', arrayBatchSubRequests);
        arrayBatchSubRequests.forEach((batchSubRequest) => {
            console.log('batchSubRequest', batchSubRequest);
            // convert from get request
            if (!batchSubRequest.payload) {
                batchSubRequest.payload = JSON.stringify(url_1.parse(batchSubRequest.path, true).query);
                batchSubRequest.path = url_1.parse(batchSubRequest.path, true).pathname;
            }
            restrictedRoutes.forEach((restrictedRoute) => {
                if (restrictedRoute.Path === batchSubRequest.path) {
                    batchSubRequestQueue.push({
                        pathName: batchSubRequest.path,
                        task: restrictedRoute.engage({
                            objectData: batchSubRequest.payload,
                            statusText: '',
                        })
                    });
                }
            });
        });
        Promise.allSettled(batchSubRequestQueue.map((batchSubRequest) => {
            return batchSubRequest.task;
        })).then((results) => {
            results.forEach((batchSubRequestResult, index) => {
                if (batchSubRequestResult.status === 'fulfilled') {
                    batchSubRequestQueueResults.push({
                        pathName: batchSubRequestQueue[index].pathName,
                        statusText: 'Congratulations, your request was succeed',
                        result: JSON.stringify(batchSubRequestResult.value),
                    });
                }
                else { // rejected
                    batchSubRequestQueueResults.push({
                        pathName: batchSubRequestQueue[index].pathName,
                        statusText: 'Your request rejected',
                        reason: JSON.stringify(batchSubRequestResult.reason),
                    });
                }
                // add else with errors
            });
            resolve({
                objectData: JSON.stringify(batchSubRequestQueueResults),
                statusText: 'Server successfully completed batch request',
            });
        });
    }
    else {
        reject({
            objectData: '',
            statusText: 'Duplicate request. Goodbye. Cancelling...',
        });
    }
}), restrictedRoutes);
exports.batchRequest = batchRequest;
