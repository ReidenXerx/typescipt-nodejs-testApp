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
