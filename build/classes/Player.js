"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(name, // задокумментировать public
    secondName, team, birthday, online) {
        this.name = name;
        this.secondName = secondName;
        this.team = team;
        this.birthday = birthday;
        this.online = online;
    }
    setId(id) {
        this._id = id;
        return this;
    }
    toggleOnline() {
        this.online = !this.online;
    }
}
exports.default = Player;
