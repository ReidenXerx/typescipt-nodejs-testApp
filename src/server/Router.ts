/* eslint-disable */
import { request, response } from 'express';
import { createServer, IncomingMessage } from 'http';
import { parse, UrlWithParsedQuery } from 'url';
import { ParsedUrlQuery } from 'querystring';

import Route from './Route';
import PlayersHandler from '../classes/PlayersHandler';
import { InterfacePlayer } from '../interfaces';
import { PORT } from '../classes/constants';

class Router {
    public playersHandler: PlayersHandler = new PlayersHandler();

    public playersDb: Array<InterfacePlayer> = [];

    private routes: Array<Route> = [];

    private port: number = PORT;

    public addRoute(newRoute: Route) {
        this.routes.push(newRoute);
    }

    private server = createServer();

    private collectRequestData(request: IncomingMessage) {
        return new Promise<string>((resolve) => {
            let insertedData = '';
            request.on('data', (chunk) => {
                response.writeHead(200);
                insertedData += chunk.toString();
            });
            request.on('end', () => {
                resolve(insertedData);
            });
            
        })
    }

    public startServer() {
        this.server.on('request', (request, response) => {
            response.writeHead(200);
            const { url } = request;
            let urlObject: UrlWithParsedQuery | null = null;

            if (url) {
                urlObject = parse(url, true);
                if (urlObject && urlObject.query !== undefined) {
                    console.log('triggered');
                    
                    this.collectRequestData(request).then((body: string) => {
        
                        if (urlObject?.pathname) {
                            new Promise((resolve, reject) => {
                                this.routes.filter((route: Route) => {
                                    if (urlObject?.pathname === route.Path) {
                                        resolve(route.engage(body));
                                    }
                                    return null;
                                });
                                reject(Error('no routes'));
                            }).then((result) => {
                                response.write(
                                    JSON.stringify(result),
                                );
                                response.end();
                            }).catch((e) => console.log(`Server failed handle route with path ${urlObject?.pathname}`, e));
                        }
                    })
                }
            }
            // var data = '';
            // request.on('data', function(chunk: any) {
            //     data += chunk.toString();
            // });
            // request.on('end', () => {
            //     const { url } = request;
            //     let urlObject: UrlWithParsedQuery | null = null;

            //     if (url) {
            //         urlObject = parse(url, true);
            //     }

            //     if (urlObject?.pathname) {
            //         new Promise((resolve, reject) => {
            //             this.routes.filter((route: Route) => {
            //                 if (urlObject?.pathname === route.Path) {
            //                     resolve(route.engage(data));
            //                 }
            //                 return null;
            //             });
            //             reject(Error('no routes'));
            //         }).then((result) => {
            //             response.write(
            //                 JSON.stringify(result),
            //             );
            //             response.end();
            //         }).catch((e) => console.log(`Server failed handle route with path ${urlObject?.pathname}`, e));
            //     }
            // });
        });

        this.server.on('request', (request, response) => {
            response.writeHead(200);
            const { url } = request;
            let urlObject: UrlWithParsedQuery | null = null;
            let query: ParsedUrlQuery | null = null;

            if (url) {
                urlObject = parse(url, true);
                query = urlObject.query;
                console.log('query', query);
                
            }
            
            if (urlObject?.pathname && true /*(Object.getPrototypeOf(query) !== null)*/) {
                new Promise((resolve, reject) => {
                    this.routes.filter((route: Route) => {
                        if (urlObject?.pathname === route.Path) {
                            console.log("ENGAGE: ", route.engage(query)) // оно не работает во время import
                            resolve(route.engage(query));
                        }
                        return null;
                    });
                    reject(Error('no routes'));
                }).then((result) => {
                    response.write(
                        JSON.stringify(result),
                    );
                    response.end();
                }).catch((e) => console.log(`Server failed handle route with path ${urlObject?.pathname}`, e));
            }
        });

        this.server.listen(this.port);
        console.log('Browse to http://127.0.0.1:' + this.port);
        // createServer((request, response) => {

        //     console.log(request);
        //     switch (request.method) {
        //         case 'POST': {
        //             this.collectRequestData(request).then((data) => {
        //                 const { url } = request;
        //                 let urlObject: UrlWithParsedQuery | null = null;

        //                 if (url) {
        //                     urlObject = parse(url, true);
        //                 }

        //                 if (urlObject?.pathname) {
        //                     new Promise((resolve, reject) => {
        //                         this.routes.filter((route: Route) => {
        //                             if (urlObject?.pathname === route.Path) {
        //                                 resolve(route.engage(data));
        //                             }
        //                             return null;
        //                         });
        //                         reject(Error('no routes'));
        //                     }).then((result) => {
        //                         response.write(
        //                             JSON.stringify(result),
        //                         );
        //                         response.end();
        //                     }).catch((e) => console.log(`Server failed handle route with path ${urlObject?.pathname}`, e));
        //                 }
        //             });
        //         }
        //         case 'GET': {
        //             const { url } = request;
        //             let urlObject: UrlWithParsedQuery | null = null;
        //             let query: ParsedUrlQuery | null = null;

        //             if (url) {
        //                 urlObject = parse(url, true);
        //                 console.log('URLOBJECT', urlObject);
        //                 query = urlObject.query;
        //             }

        //             if (urlObject?.pathname && query) {
        //                 new Promise((resolve, reject) => {
        //                     this.routes.filter((route: Route) => {
        //                         if (urlObject?.pathname === route.Path) {
        //                             resolve(route.engage(query));
        //                         }
        //                         return null;
        //                     });
        //                     reject(Error('no routes'));
        //                 }).then((result) => {
        //                     response.write(
        //                         JSON.stringify(result),
        //                     );
        //                     response.end();
        //                 }).catch((e) => console.log(`Server failed handle route with path ${urlObject?.pathname}`, e));
        //             }
        //         }
        //     }
        // }).listen(this.port, () => {
        //     console.log(`Server listen on the port ${this.port}`);
        // });
    }
}

export default Router;
