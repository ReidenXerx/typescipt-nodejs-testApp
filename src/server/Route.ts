import { TransferDataWrapper } from '../interfaces';
import Middleware from './Middleware';

class Route {
    constructor(
        private path: string,
        private callback: (objectData: TransferDataWrapper, lastRequestData: string) => Promise<any>,
        private middleware?: Middleware,
        // prevent duplicates of requests
        private lastRequestData: string = '',
    ) {}

    get Path() {
        return this.path;
    }

    set lastRequestDataSetter(lastRequestData: string) {
        this.lastRequestData = lastRequestData;
    }

    get Callback() {
        return this.callback;
    }

    public engage(objectData: TransferDataWrapper) {
        if (this.middleware) {
            return this.callback(
                this.middleware.run(objectData),
                this.lastRequestData,
            );
        }
        return this.callback(objectData, this.lastRequestData);
    }
}

export default Route;
