import { Document } from "mongoose";
import { InterfacePlayer, InterfacePlayerDocument, InterfacePlayerSelector } from "../inerfaces";
import Player from "./Player";

class PlayersHandler {
    private playersDb: Array<InterfacePlayerDocument> = [];
    constructor() {};
    
    public addPlayer(player: InterfacePlayerDocument): void {
        this.playersDb.push(player);
    }
    
    public importPlayers(playersDb: Array<InterfacePlayerDocument>): void {
        this.playersDb = playersDb;
    }
    
    public clearPlayers(): void {
        this.playersDb = [];
    }

    public getPlayer(index: number): InterfacePlayerDocument | InterfacePlayer {
        return this.playersDb[index];
    }

    // // get PlayersDb:

    // public getPlayersCollection(selector: InterfacePlayerSelector): Array<InterfacePlayerDocument> {
    //     return this.playersDb.filter((player) => {
    //         if(
    //             (() => {//IIF
    //                 Object.keys(selector).forEach((selectorKey: keyof InterfacePlayer | string) => {
    //                     if(selector[selectorKey as keyof InterfacePlayer] !== player[selectorKey as keyof InterfacePlayer]) {
    //                         return false;
    //                     }
    //                 });
    //                 return true;
    //             })()
    //         ) {

    //         }
    //     })
    // }
}

export default PlayersHandler;