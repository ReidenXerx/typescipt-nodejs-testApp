/* eslint-disable */
import { createServer, IncomingMessage } from 'http';
import { parse, UrlWithParsedQuery } from 'url';
import { ParsedUrlQuery } from 'querystring';

import Route from './Route';
import { TransferDataWrapper } from '../interfaces';
import { PORT } from '../classes/constants';

class Router {

    private routes: Array<Route> = [];

    private port: number = PORT;

    public addRoute(newRoute: Route) {
        this.routes.push(newRoute);
    }

    get Routes() {
        return this.routes;
    }

    private server = createServer();

    private collectRequestData(request: IncomingMessage) {
        return new Promise<string>((resolve) => {
            let insertedData = '';
            request.on('data', (chunk) => {
                insertedData += chunk.toString();
            });
            request.on('end', () => {
                resolve(insertedData);
            });
            
        })
    }

    // + тела запроса нет только у гета, а также может не быть у делита
    // + реквест он дата возвращает тело запроса, в случае делита мы вытягиваем данные из юрл
    // + get, pose, put, delete, patch
    // интеграция многопоточности
    // NODE_ENV переменная окружения, с помощью нее передавать порт, хостнейп и протокол, и пр. Прописывается в package.json
    // + общий интерфейс для чего-нибудь
    // + проблема с случайным повторением записей
    public startServer() {
        this.server.on('request', (request, response) => {
            // response.writeHead(200);
            const { url } = request;
            let urlObject: UrlWithParsedQuery | null = null;
            let query: ParsedUrlQuery | string = ''; 

            if (url) {
                urlObject = parse(url, true);
                query = urlObject.query ? urlObject.query : '';
                if (urlObject && !query) {
                    this.collectRequestData(request).then((body: string) => {
                        if (urlObject?.pathname) {
                            this.routes.filter((route: Route) => {
                                if (urlObject?.pathname === route.Path) {
                                    route.engage(
                                        {
                                            objectData: body,
                                            statusText: '',
                                        } as TransferDataWrapper,
                                    ).then((resultFromRoute: TransferDataWrapper) => {
                                        route.lastRequestDataSetter = resultFromRoute.lastRequestData;
                                        response.write(
                                            JSON.stringify(resultFromRoute),
                                        );
                                        response.end();
                                    }).catch((errorFromRoute: TransferDataWrapper) => {
                                        response.write(
                                            JSON.stringify(errorFromRoute),
                                        );
                                        response.end();
                                    })
                                }
                                return null;
                            });
                        }
                    })
                }
            }
        });

        this.server.on('request', (request, response) => {
            const { url } = request;
            let urlObject: UrlWithParsedQuery | null = null;
            let query: ParsedUrlQuery | string = '';

            if (url) {
                urlObject = parse(url, true);
                query = urlObject.query;
                if(urlObject && query) {
                    if (urlObject?.pathname) {
                        this.routes.forEach((route: Route) => {
                            if (urlObject?.pathname === route.Path) {
                                route.engage(
                                    {
                                        objectData: query,
                                        statusText: '',
                                    } as TransferDataWrapper,
                                ).then((resultFromRoute: TransferDataWrapper) => {
                                    response.write(
                                        JSON.stringify(resultFromRoute),
                                    );
                                    response.end();
                                }).catch((errorFromRoute: TransferDataWrapper) => {
                                    response.write(
                                        JSON.stringify(errorFromRoute),
                                    );
                                    response.end();
                                });
                            }
                            return null;
                        });
                    }
                }
            }
        });

        this.server.listen(this.port);
        console.log('Browse to http://127.0.0.1:' + this.port);
    }
}

export default Router;
