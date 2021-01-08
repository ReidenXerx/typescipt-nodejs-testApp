import { response } from "express";
import { get } from "http";
import { Document } from "mongoose";
import { format, parse } from "url";
import Player from "./classes/Player";
import { dbInsert, dbSelect } from "./connectorDb";
import { InterfacePlayer } from "./inerfaces";
import Route from "./server/Route";
import Router from "./server/Router";

const router: Router = new Router();
router.startServer();
const request = parse(format({
    protocol: 'http',
    hostname: 'localhost',
    pathname: '/add',
    port: 1337,
    query: {
        player: JSON.stringify(new Player(
            'Mihail',
            'Giant',
            'teamless',
            new Date('10.05.1995'),
            true,
        ))
    },
}));

router.addRoute(new Route(
    `/add`,
    ({ player }: {player: string}) => {
        dbInsert(JSON.parse(player)).then((playerInserted: Document<InterfacePlayer>) => {
            router.playersHandler.addPlayer(
                playerInserted,
            );
            return `Server successfully created player and flash it in the DB...`;
        });
    },
));

//можно объединить селект и релоад с помощью миддлвара и параметров
router.addRoute(new Route(
    `/import`,
    ({ player }: {player: string}) => {
        dbSelect(JSON.parse(player)).then((playersCollection: Array<Document<InterfacePlayer>>) => {
            router.playersHandler.importPlayers(playersCollection);
            return `Server successfully import players collection from DB...`;
        });
    },
));

router.addRoute(new Route(
    `/reload`,
    ({ player }: {player: string}) => {
        dbSelect(JSON.parse(player)).then((playersCollection: Array<Document<InterfacePlayer>>) => {
            router.playersHandler.clearPlayers();
            router.playersHandler.importPlayers(playersCollection);
            return `Server successfully reloaded players collection from DB...`;
        });
    },
));

get({
    hostname: request.hostname,
    port: request.port,
    path: request.path,
}, (res) => {
    res.on('data', (response) => {
        const data = JSON.parse(response);
        console.log(`Got from server`);
        console.log(data);
        
    })
})

dbSelect();