import { Document } from "mongoose";
import { InterfacePlayer } from "../inerfaces";
import Player from "./Player";

class PlayersHandler {
    private players: Array<Document<InterfacePlayer>> = [];
    constructor() {};
    
    public getPlayer(index: number): Document<InterfacePlayer> {
        return this.players[index];
    }
    
    public addPlayer(player: Document<InterfacePlayer>): void {
        this.players.push(player);
    }

    public importPlayers(players: Array<Document<InterfacePlayer>>): void {
        this.players = this.players.concat(players);
    }

    public clearPlayers(): void {
        this.players = [];
    }
}

export default PlayersHandler;