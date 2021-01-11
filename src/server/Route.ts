import Middleware from "./Middleware";

class Route {
    constructor(
        private path: string,
        private callback: Function,
        private middleware?: Middleware,
    ) {};

    get Path() {
        return this.path;
    }

    get Callback() {
        return this.callback;
    }

    public engage(objectData: Object | null) {
        if(this.middleware) {
            return this.callback(
                this.middleware.run(objectData),
            );
        } else {
            return this.callback(objectData);
        }
    }
};

export default Route;