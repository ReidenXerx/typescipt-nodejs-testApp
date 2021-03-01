import { TransferDataWrapper } from '../interfaces';
import Middleware from './Middleware';

class Route {
    constructor(
        private path: string,
        private callback: (objectData: TransferDataWrapper) => Promise<any>,
        private middleware?: Middleware,

    ) {}

    get Path() {
        return this.path;
    }

    get Callback() {
        return this.callback;
    }

    public engage(objectData: TransferDataWrapper) {
        if (this.middleware) {
            return this.callback(
                this.middleware.run(objectData),
            );
        }
        return this.callback(objectData);
    }
}

export default Route;
