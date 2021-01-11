import { Document, Model } from "mongoose";
import Human from "./classes/Human";

export interface InterfacePlayer {
    _id?: string,
    name: string,
    secondName: string,
    team: string,
    birthday: Date,
    online: Boolean,
};

export interface InterfacePlayerDocument extends Document {
    _id?: string,
    name: string,
    secondName: string,
    team: string,
    birthday: Date,
    online: Boolean,
};

export interface InterfacePlayerModel extends Model<InterfacePlayerDocument> {
    
}

export interface InterfacePlanet {
    name: string,
    galactic: 'MilkyWay' | 'another',
};

export interface InterfaceHuman {
    sex: 'male' | 'female',
    planet: InterfacePlanet,
};

export interface InterfacePlayerSelector {
    _id?: string,
    name?: string,
    secondName?: string,
    team?: string,
    birthday?: Date,
    online?: Boolean,
};