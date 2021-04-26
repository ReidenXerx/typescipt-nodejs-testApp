"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const http_1 = require("http");
const url_1 = require("url");
class Router {
    constructor() {
        this.routes = [];
        this.port = parseInt(process.env.PORT || '1337');
        this.server = http_1.createServer();
    }
    addRoute(newRoute) {
        this.routes.push(newRoute);
    }
    get Routes() {
        return this.routes;
    }
    collectRequestData(request) {
        return new Promise((resolve) => {
            let insertedData = '';
            request.on('data', (chunk) => {
                insertedData += chunk.toString();
            });
            request.on('end', () => {
                resolve(insertedData);
            });
        });
    }
    // + тела запроса нет только у гета, а также может не быть у делита
    // + реквест он дата возвращает тело запроса, в случае делита мы вытягиваем данные из юрл
    // + get, pose, put, delete, patch
    // интеграция многопоточности
    // + NODE_ENV переменная окружения, с помощью нее передавать порт, хостнейп и протокол, и пр. Прописывается в package.json
    // + общий интерфейс для чего-нибудь
    // + проблема с случайным повторением записей
    // тестирование mocha + chai + typescript types + штука для низкоуровневого тестирования моделей на сервере для монги
    // + почитать как развернуть на удаленном сервере (NginX)
    startServer() {
        this.server.on('request', (request, response) => {
            const { url } = request;
            let urlObject = null;
            let query = '';
            if (url) {
                urlObject = url_1.parse(url, true);
                query = urlObject.query;
                if (urlObject?.pathname) {
                    this.collectRequestData(request).then((body) => {
                        if (body) {
                            this.routes.filter((route) => {
                                if (urlObject?.pathname === route.Path) {
                                    route.engage({
                                        objectData: body,
                                        statusText: '',
                                    }).then((resultFromRoute) => {
                                        route.lastRequestDataSetter = resultFromRoute.lastRequestData;
                                        response.write(JSON.stringify(resultFromRoute));
                                        response.end();
                                    }).catch((errorFromRoute) => {
                                        response.write(JSON.stringify(errorFromRoute));
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
        this.server.on('request', (request, response) => {
            const { url } = request;
            let urlObject = null;
            let query = '';
            if (url) {
                urlObject = url_1.parse(url, true);
                query = urlObject.query;
                console.log('triggered', query);
                if (urlObject.pathname) {
                    this.collectRequestData(request).then((body) => {
                        if (!body) {
                            this.routes.forEach((route) => {
                                if (urlObject?.pathname === route.Path) {
                                    route.engage({
                                        objectData: JSON.stringify(query),
                                        statusText: '',
                                    }).then((resultFromRoute) => {
                                        response.write(JSON.stringify(resultFromRoute));
                                        response.end();
                                    }).catch((errorFromRoute) => {
                                        response.write(JSON.stringify(errorFromRoute));
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
exports.default = Router;
