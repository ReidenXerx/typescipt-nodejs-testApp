import { Document } from "mongoose";
import Human from "./classes/Human";

export interface InterfacePlayer {
    _id?: string,
    name: string,
    secondName: string,
    team: string,
    birthday: Date,
    online: Boolean,
};

export interface InterfacePlanet {
    name: string,
    galactic: 'MilkyWay' | 'another',
};

export interface InterfaceHuman {
    sex: 'male' | 'female',
    planet: InterfacePlanet,
};