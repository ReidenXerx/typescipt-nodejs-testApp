import { request, response } from 'express';
import { createServer } from 'http';
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

    private handleGet() {
        const { url } = request;
        let urlObject: UrlWithParsedQuery | null = null;
        let query: ParsedUrlQuery | null = null;
        if (url) {
            urlObject = parse(url, true);
            query = urlObject.query;
        }

        if (urlObject?.pathname && query) {
            new Promise((resolve, reject) => {
                this.routes.filter((route: Route) => {
                    if (urlObject?.pathname === route.Path) {
                        console.log('true', urlObject?.pathname, route.Path);
                        resolve(route.engage(query));
                    }
                });
                reject('no routes');
            }).then((result) => {
                response.write(
                    JSON.stringify(result),
                );
                response.end();
            }).catch((e) => console.log(`Server failed handle route with path ${urlObject?.pathname}`, e));
        }
    }

    public startServer() {
        createServer((request, response) => {
            const { url } = request;
            let urlObject: UrlWithParsedQuery | null = null;
            let query: ParsedUrlQuery | null = null;

            let result: string = '';
            request.on('data', (data) => {
                result = `${result}${data.toString('utf8')}`;
                const object = JSON.parse(data);
                console.log('DATA', result);
            });
            if (url) {
                urlObject = parse(url, true);
                console.log('URLOBJECT', urlObject);

                query = urlObject.query;
            }
            console.log('started');

            if (urlObject?.pathname && query) {
                new Promise((resolve, reject) => {
                    console.log('ROUTES START', this.routes, 'ROUTES END');
                    console.log(urlObject?.pathname, 'URL OBJECT');
                    this.routes.filter((route: Route) => {
                        if (urlObject?.pathname === route.Path) {
                            console.log('true', urlObject?.pathname, route.Path);
                            resolve(route.engage(query));
                        }
                    });
                    reject('no routes');
                }).then((result) => {
                    response.write(
                        JSON.stringify(result),
                    );
                    response.end();
                }).catch((e) => console.log(`Server failed handle route with path ${urlObject?.pathname}`, e));
            }
        }).listen(this.port, () => {
            console.log(`Server listen on the port ${this.port}`);
        });
    }
}

export default Router;
