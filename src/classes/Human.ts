import { InterfaceHuman, InterfacePlanet } from "../inerfaces";

abstract class Human implements InterfaceHuman {
    sex: 'male' | 'female' = 'male';
    planet = {
        name: `Earth`,
        galactic: 'MilkyWay'
    } as InterfacePlanet;
};

export default Human;