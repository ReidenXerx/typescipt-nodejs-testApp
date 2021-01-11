import { request, response } from "express";
import { createServer } from "http";
import { parse } from "url";
import { ParsedUrlQuery } from "querystring";
import { UrlWithParsedQuery } from "url";
import Route from "./Route";
import PlayersHandler from "../classes/PlayersHandler";
import mockDB from "../connectorDb";
import { InterfacePlayerDocument } from "../inerfaces";

import { PORT } from "../index";

class Router {
    public playersHandler: PlayersHandler = new PlayersHandler();
    public playersDb: Array<InterfacePlayerDocument> = [];
    private routes: Array<Route> = [];
    private port: number = PORT;

    public addRoute(newRoute: Route) {
        this.routes.push(newRoute);
    }

    public startServer() {
        createServer((request, response) => {
            const url = request.url;
            let urlObject: UrlWithParsedQuery | null = null;
            let query: ParsedUrlQuery | null = null;
            if (url) {
                urlObject = parse(url, true);
                query = urlObject.query;
            }
            if (urlObject?.pathname && query) {
                new Promise((resolve, reject) => {//не нужен?
                    //console.log("ROUTES START", this.routes, "ROUTES END")
                    console.log(urlObject?.pathname, "URL OBJECT")
                    this.routes.filter( (route: Route) => {
                        if (urlObject?.pathname === route.Path) {
                            console.log("true", urlObject?.pathname, route.Path)
                            //при неизвестных параметрах передаем целый объект, а там деструктуризация
                            //console.log(query);

                            resolve(route.engage(query));
                        }
                    });
                    reject("no routes");
                }).then((result) => {
                    console.log(result, "RESULT")
                    response.write(
                        JSON.stringify(result)
                    );
                    response.end();
                }).catch((e) => console.log(`Server failed handle route with path ${urlObject?.pathname}`, e));
            }
        }).listen(this.port, () => {
            console.log(`Server listen on the port ${this.port}`);
        })
    }
}

export default Router;