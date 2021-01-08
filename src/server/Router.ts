import { request, response } from "express";
import { createServer } from "http";
import { parse } from "url";
import { ParsedUrlQuery } from "querystring";
import { UrlWithParsedQuery } from "url";
import Route from "./Route";
import PlayersHandler from "../classes/PlayersHandler";
import mockDB from "../connectorDb";

class Router {
    public playersHandler: PlayersHandler = new PlayersHandler();
    private routes: Array<Route> = [];
    private port: number = 1337;

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
                let forReturn;
                new Promise((resolve) => {
                    this.routes.filter((route: Route) => {
                        if (urlObject?.pathname === route.Path) {
                            forReturn = route.Callback(query)//при неизвестных параметрах передаем целый объект, а там деструктуризация
                            //resolve(forReturn);
                        }
                    });
                }).then((result) => {
                    response.write(
                        JSON.stringify(result)
                    );
                    response.end();
                }).catch(() => console.log(`fuck you`));
            }
        }).listen(this.port, () => {
            console.log(`Server listen on the port ${this.port}`);
        })
    }
}

export default Router;