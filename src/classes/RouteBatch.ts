import { TransferDataWrapper } from "../interfaces";
import Middleware from "../server/Middleware";
import Route from "../server/Route";

export default class RouteBatch extends Route {
    restrictedRoutes: Array<Route> = [];

    constructor(
        path: string,
        callback: (objectData: TransferDataWrapper,lastRequestData: string) => Promise<any>,
        restrictedRoutes: Array<Route>,
        middleware?: Middleware,
        // prevent duplicates of requests
        lastRequestData: string = '',
    ) {
        super(path, callback, middleware, lastRequestData);
        this.restrictedRoutes = restrictedRoutes;
    }

    get RestrictedRoutes() {
        return this.restrictedRoutes;
    }

}