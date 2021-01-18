import { get } from "http";
import { InterfacePlayer, InterfacePlayerSelector } from "./interfaces";
import { importDocs } from "./routes";
import { requestImport, requestUpdate } from "./requests";
import Route from "./server/Route";
import Router from "./server/Router";

export const PORT = 1337;

const router: Router = new Router();
router.startServer();
router.addRoute(importDocs(router));

var stdin = process.openStdin();
var stdinSecond = process.openStdin();

stdin.addListener("data", function(d) { 
    switch(d) {
        case 'insert': {
            stdinSecond.addListener('data', (object) => {
                console.log(object.toString().trim());
            });
        };
        case 'import': {
            get({
                hostname: requestImport.hostname,
                port: requestImport.port,
                path: requestImport.path,
            }, async (res) => {
                await res.on('data', (response) => {
                    const data = JSON.parse(response);
                    console.log(`Got from server after import`);
                    console.log(data); 
                    console.log(`DB list:`);
                });
            });
        }
    }
    console.log("you entered: [" + 
        d.toString().trim() + "]");
  });


// router.addRoute(new Route(
//     `/reload`,
//     ({ player }: {player: string}) => {
//         return dbSelect(JSON.parse(player) as InterfacePlayerSelector).then((playersCollection: Array<InterfacePlayerDocument>) => {
//             router.playersDb = [];
//             router.playersDb = playersCollection;
//             return `Server successfully reloaded players collection from DB...`;
//         });
//     },
// ));

( () => {
        get({
            hostname: requestImport.hostname,
            port: requestImport.port,
            path: requestImport.path,
        }, async (res) => {
            await res.on('data', (response) => {
                const data = JSON.parse(response);
                console.log(`Got from server after import`);
                console.log(data);
                
            });            // get({
            //     hostname: requestUpdate.hostname,
            //     port: requestUpdate.port,
            //     path: requestUpdate.path,
            // }, async (res) => {
            //     await res.on('data', (response) => {
            //         const data = JSON.parse(response);
            //         console.log(`Got from server after insert`);
            //         console.log(data);
                    
            //     })
            // })
        });
    })();


// get({
//     hostname: requestAdd.hostname,
//     port: requestAdd.port,
//     path: requestAdd.path,
// }, async (res) => {
//     await res.on('data', (response) => {
//         const data = JSON.parse(response);
//         console.log(`Got from server`);
//         console.log(data);
        
//     })
// });


