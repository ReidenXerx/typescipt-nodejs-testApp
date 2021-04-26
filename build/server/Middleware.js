"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Middleware {
    constructor(chainHandlers = []) {
        this.chainHandlers = chainHandlers;
    }
    use(handler) {
        this.chainHandlers.push(handler);
    }
    executeMiddleware(objectData) {
        return this.chainHandlers.reduce((previousReturned, currentHandler) => currentHandler(previousReturned), objectData);
    }
    run(objectData) {
        return this.executeMiddleware(objectData);
    }
}
exports.default = Middleware;
