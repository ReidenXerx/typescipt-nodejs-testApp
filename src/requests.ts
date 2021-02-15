import { format, parse, UrlObject, UrlWithStringQuery } from 'url';
import { request, RequestOptions } from 'http';
import { PORT } from './classes/constants';
import { InterfacePlayer, InterfacePlayerSelector } from './interfaces';
import Player from './classes/Player';

const requestAdd = parse(format({
    protocol: 'http',
    hostname: 'localhost',
    pathname: '/add',
    port: PORT,
    query: {
        player: JSON.stringify({
            name: 'Mihail',
            secondName: 'Giant',
            team: 'teamless',
            birthday: new Date('10.05.1995'),
            online: true,
        } as InterfacePlayer),
    },
}));

const requestGET = (options: RequestOptions, callback: Function) => {
    let responsedData = '';

    return request(options, (res) => {
        res.on('data', (chunk) => {
            responsedData += chunk;
        });

        res.on('end', () => {
            callback(responsedData);
            // const obj = JSON.parse(responsedData);
            // return obj;
        });
    });
};

const requestPOST = (options: RequestOptions, callback: Function) => {
    let responsedData = '';

    return request(options, (res) => {
        res.on('data', (chunk) => {
            responsedData += chunk;
        });

        res.on('end', () => {
            callback(responsedData);
            // const obj = JSON.parse(responsedData);
            // return obj;
        });
    });

    // req.write(sendingOjbect);

    // req.end();
};

const requestUpdate = parse(format({
    protocol: 'http',
    hostname: 'localhost',
    pathname: '/updatePlayers',
    port: PORT,
    query: {
        playerUpdate: JSON.stringify(
            {
                birthday: new Date('10.06.2001'),
            } as InterfacePlayerSelector,
        ),
        selector: JSON.stringify(
            {
                name: 'Mihail',
                secondName: 'Giant',
            } as InterfacePlayerSelector,
        ),
    },
}));

const requestImportOPTIONS = (player: InterfacePlayerSelector) => {
    const urlObject: UrlWithStringQuery = parse(format({
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/import',
        port: PORT,
        query: {
            player: JSON.stringify(
                player as InterfacePlayerSelector,
            ),
        },
    }));
    return {
        hostname: 'localhost',
        port: PORT,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        path: urlObject.path,
    };
};

const requestInsertOPTIONS: RequestOptions = {
    hostname: 'localhost',
    port: PORT,
    path: '/insert',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
};

export { requestAdd, requestImportOPTIONS, requestInsertOPTIONS, requestUpdate, requestPOST, requestGET };