import { ClientRequest, get, IncomingMessage, request } from "http";
import { InterfacePlayer, InterfacePlayerSelector } from "./interfaces";
import { importDocs, insertDocs } from "./routes";
import { requestImport, requestUpdate } from "./requests";
import Route from "./server/Route";
import Router from "./server/Router";

const router: Router = new Router();
router.startServer();
router.addRoute(importDocs(router));
router.addRoute(insertDocs(router));

var stdin = process.openStdin();
var stdinSecond = process.openStdin();

stdin.addListener("data", function(d) { 
    switch(d.toString().trim()) {
        case 'insert': {
            stdinSecond.addListener('data', (object) => {
                const inputed = object.toString().trim();
                let req: ClientRequest | null = null;
                if(inputed) {
                    req = request({
                        hostname: requestImport.hostname,
                        port: requestImport.port,
                        path: '/insert',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }, (res: IncomingMessage) => {
                        let data = '';

                        res.on('data', (responseChunk) => {
                            data = `${data}${responseChunk.toString('utf8')}`;
                            const object = JSON.parse(data);
                        });

                        res.on('end', () => {
                            console.log('recieved data', data);
                        });
                    });
                    req?.write(
                        JSON.stringify(
                            [
                                {
                                    name: 'Mihail',
                                    secondName: 'Giant',
                                    team: 'teamless',
                                    birthday: new Date('10.05.1995'),
                                    online: true,
                                } as InterfacePlayer,
                            ]
                        )
                    );
                    req.end();
                };

            });
            break;
        };
        case 'import': {
            get({
                hostname: requestImport.hostname,
                port: requestImport.port,
                path: requestImport.path,
            },  (res) => {
                 res.on('data', (response) => {
                    const data = JSON.parse(response);
                    console.log(`Got from server after import`);
                    console.log(data); 
                    console.log(`DB list:`);
                });
            });
            break;
        };
    }
    console.log("you entered: [" + 
        d.toString().trim() + "]");
  });