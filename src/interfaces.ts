export interface InterfacePlayer {
    _id?: string,
    name: string,
    secondName: string,
    team: string,
    birthday: Date,
    online: Boolean,
}

export interface InterfacePlayerSelector {
    _id?: string,
    name?: string,
    secondName?: string,
    team?: string,
    birthday?: Date,
    online?: Boolean,
}

export interface TransferDataWrapper {
    [customField: string]: any,
    objectData: string,
    statusText: string,
}

export interface BatchSubRequest {
    path: string,
    payload: string,
}

export interface BatchSubRequestResult {
    pathName: string, // using like name
    statusText: string,
    result?: string,
    reason?: string,
}

export interface BatchSubRequestQueueTask {
    pathName: string,
    task: Promise<any>,
}