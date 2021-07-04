"use strict";
/* eslint-disable no-console */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchRequest = exports.insertDocs = exports.importDocs = void 0;
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
                // eslint-disable-next-line prefer-promise-reject-errors
                console.log('error', error);
                reject({
                    objectData: JSON.stringify(error),
                    statusText: 'Sorry, something went wrong',
                    lastRequestData: filterPlayer,
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
    }
}));
exports.importDocs = importDocs;
const insertDocs = () => new Route_1.default('/insert', ({ objectData: arrayForInsert }, lastRequestData) => new Promise((resolve, reject) => {
    if (arrayForInsert !== lastRequestData) {
        let playersArray = [];
        playersArray = JSON.parse(arrayForInsert);
        connectorDb_1.dbInsert(playersArray).then((playerInserted) => {
            resolve({
                objectData: JSON.stringify(playerInserted),
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
        arrayBatchSubRequests = arrayBatchSubRequests.map((batchSubRequest) => {
            console.log('batchSubRequest', batchSubRequest);
            const batchSubRequestCopy = batchSubRequest;
            // convert from get request
            if (!batchSubRequest.payload) {
                batchSubRequestCopy.payload = JSON.stringify(url_1.parse(batchSubRequest.path, true).query);
                batchSubRequestCopy.path = url_1.parse(batchSubRequest.path, true).pathname;
            }
            restrictedRoutes.forEach((restrictedRoute) => {
                if (restrictedRoute.Path === batchSubRequestCopy.path) {
                    batchSubRequestQueue.push({
                        pathName: batchSubRequestCopy.path,
                        task: restrictedRoute.engage({
                            objectData: batchSubRequestCopy.payload,
                            statusText: '',
                        }),
                    });
                }
            });
            return batchSubRequestCopy;
        });
        Promise.allSettled(batchSubRequestQueue.map((batchSubRequest) => batchSubRequest.task)).then((results) => {
            results.forEach((batchSubRequestResultedArray, index) => {
                if (batchSubRequestResultedArray.status === 'fulfilled') {
                    batchSubRequestQueueResults.push({
                        pathName: batchSubRequestQueue[index].pathName,
                        statusText: 'Congratulations, your request was succeed',
                        result: JSON.stringify(batchSubRequestResultedArray.value),
                    });
                }
                else { // rejected
                    batchSubRequestQueueResults.push({
                        pathName: batchSubRequestQueue[index].pathName,
                        statusText: 'Your request rejected',
                        reason: JSON.stringify(batchSubRequestResultedArray.reason),
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
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
            objectData: '',
            statusText: 'Duplicate request. Goodbye. Cancelling...',
        });
    }
}), restrictedRoutes);
exports.batchRequest = batchRequest;
