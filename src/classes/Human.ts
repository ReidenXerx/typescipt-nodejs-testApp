import { InterfaceHuman, InterfacePlanet } from "../interfaces";

abstract class Human implements InterfaceHuman {
    sex: 'male' | 'female' = 'male';
    planet = {
        name: `Earth`,
        galactic: 'MilkyWay'
    } as InterfacePlanet;
};

export default Human;