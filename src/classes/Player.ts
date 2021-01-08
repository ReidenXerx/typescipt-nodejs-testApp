import { InterfacePlayer } from "../inerfaces";
import Human from "./Human";

class Player implements InterfacePlayer {
    public _id?: string;
    constructor(public name: string,//задокумментировать public
    public secondName: string,
    public team: string,
    public birthday: Date,
    public online: Boolean) {};

    setId(id: string): Player { //документация лайфхака
        this._id = id;
        return this;
    }

    toggleOnline(): void {
        this.online = !this.online;
    };
}

export default Player;