/* eslint-disable */
import {
    ClientRequest, get, IncomingMessage, request,
} from 'http';
import { InterfacePlayer } from './interfaces';
import { importDocs, insertDocs } from './routes';
import { requestImportOPTIONS, requestInsertOPTIONS, requestPOST, requestGET } from './requests';
import Router from './server/Router';
import { response } from 'express';

const router: Router = new Router();
router.startServer();
router.addRoute(importDocs(router));
router.addRoute(insertDocs(router));

const stdin = process.openStdin();
const stdinSecond = process.openStdin();

stdin.addListener('data', (d) => {
    switch (d.toString().trim()) {
        case 'insert': {
            stdinSecond.addListener('data', (object) => {
                console.log("insert name: ");
                const inputed = object.toString().trim();
                let req: ClientRequest | null = null;
                if (inputed) {
                    const req = requestPOST(requestInsertOPTIONS, ((responsedData: string) => {
                        console.log(responsedData);
                    }))

                    req.write(
                        JSON.stringify(
                            [
                                {
                                    name: 'Mihail',
                                    secondName: 'Giant',
                                    team: 'teamless',
                                    birthday: new Date('10.05.1995'),
                                    online: true,
                                } as InterfacePlayer,
                            ],
                        )
                    );
                    req.end();
                    
                    // req = request({
                    //     hostname: requestImport.hostname,
                    //     port: requestImport.port,
                    //     path: '/insert',
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    // }, (res: IncomingMessage) => {
                    //     let data = '';

                    //     res.on('data', (responseChunk) => {
                    //         data = `${data}${responseChunk.toString('utf8')}`;
                    //         const object = JSON.parse(data);
                    //     });

                    //     res.on('end', () => {
                    //         console.log('recieved data', data);
                    //     });
                    // });
                    // req?.write(
                    //     JSON.stringify(
                    //         [
                    //             {
                    //                 name: 'Mihail',
                    //                 secondName: 'Giant',
                    //                 team: 'teamless',
                    //                 birthday: new Date('10.05.1995'),
                    //                 online: true,
                    //             } as InterfacePlayer,
                    //         ],
                    //     )
                    // );
                    // req.end();

                }
            });
            break;
        }
        case 'import': {
            console.log('requestImportOPTIONS', requestImportOPTIONS);
            
            const req = requestGET(requestImportOPTIONS({}), (response: any) => {
                //const data = JSON.parse(response);
                    console.log('Got from server after import');
                    console.log(response);
                    console.log('DB list:');
            });
            req.end();
            // get({
            //     hostname: requestImportOPTIONS.hostname,
            //     port: requestImportOPTIONS.port,
            //     path: requestImportOPTIONS.path,
            // }, (res) => {
            //     res.on('data', (response) => {
            //         const data = JSON.parse(response);
            //         console.log('Got from server after import');
            //         console.log(data);
            //         console.log('DB list:');
            //     });
            // });
            break;
        }
    }
    console.log(`you entered: [${
        d.toString().trim()}]`);
});
