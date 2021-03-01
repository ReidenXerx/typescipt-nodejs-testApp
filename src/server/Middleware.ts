import { TransferDataWrapper } from "../interfaces";

class Middleware {// задокумментировать
    constructor(
        private chainHandlers: Array<Function> = [],
    ) {}

    public use(handler: Function) {
        this.chainHandlers.push(handler);
    }

    private executeMiddleware(objectData: TransferDataWrapper): TransferDataWrapper {
        return this.chainHandlers.reduce(
            (previousReturned, currentHandler) => currentHandler(previousReturned),
            objectData,
        );
    }

    public run(objectData: TransferDataWrapper): TransferDataWrapper {
        return this.executeMiddleware(objectData);
    }
}

export default Middleware;
