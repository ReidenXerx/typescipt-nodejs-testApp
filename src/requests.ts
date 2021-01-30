import { format, parse } from "url";
import { PORT } from "./classes/constants";
import { InterfacePlayer, InterfacePlayerSelector } from "./interfaces";
import { request, RequestOptions } from "http";


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
        } as InterfacePlayer)
    },
}));

const requestGET = (options: RequestOptions) => {
    let output = '';

    const req = request(options, (res) => {

        res.on('data', (chunk) => {
            output += chunk;
        });

        res.on('end', () => {
            let obj = JSON.parse(output);
            console.log(obj);
            
        });
    });

    req.on('error', (err) => {
    // res.send('error: ' + err.message);
    });

    req.end();
}

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
                name: `Mihail`,
                secondName: `Giant`,
            } as InterfacePlayerSelector,
        ),
    },
}));

const requestImport = parse(format({
    protocol: 'http',
    hostname: 'localhost',
    pathname: '/import',
    port: PORT,
    query: {
        player: JSON.stringify(
            {} as InterfacePlayerSelector,
        ),
    },
}));

export { requestAdd, requestImport, requestUpdate };