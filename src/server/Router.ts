/* eslint-disable */
import { createServer, IncomingMessage } from 'http';
import { parse, UrlWithParsedQuery } from 'url';
import { ParsedUrlQuery } from 'querystring';

import Route from './Route';
import { TransferDataWrapper } from '../interfaces';

class Router {

    private routes: Array<Route> = [];

    private port: number = parseInt(process.env.PORT || '1337');

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
    // + NODE_ENV переменная окружения, с помощью нее передавать порт, хостнейп и протокол, и пр. Прописывается в package.json
    // + общий интерфейс для чего-нибудь
    // + проблема с случайным повторением записей
    // тестирование mocha + chai + typescript types + штука для низкоуровневого тестирования моделей на сервере для монги
    // почитать как развернуть на удаленном сервере (NginX)
    public startServer() {
        this.server.on('request', (request, response) => {
            const { url } = request;
            let urlObject: UrlWithParsedQuery | null = null;
            let query: ParsedUrlQuery | string = ''; 

            if (url) {
                urlObject = parse(url, true);
                query = urlObject.query;
                if (urlObject?.pathname) {
                    
                    this.collectRequestData(request).then((body: string) => {
                        
                        if (body) {
                        
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
                
                console.log('triggered', query);
                if(urlObject.pathname) {
                    this.collectRequestData(request).then((body: string) => {
                        if (!body) {
                            this.routes.forEach((route: Route) => {
                                if (urlObject?.pathname === route.Path) {
                                    route.engage(
                                        {
                                            objectData: JSON.stringify(query),
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
                    });
                }
            }
        });

        this.server.listen(this.port);
        console.log('Browse to http://127.0.0.1:' + this.port);
    }
}

export default Router;
