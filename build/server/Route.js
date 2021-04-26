"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Route {
    constructor(path, callback, middleware, 
    // prevent duplicates of requests
    lastRequestData = '') {
        this.path = path;
        this.callback = callback;
        this.middleware = middleware;
        this.lastRequestData = lastRequestData;
    }
    get Path() {
        return this.path;
    }
    set lastRequestDataSetter(lastRequestData) {
        this.lastRequestData = lastRequestData;
    }
    get Callback() {
        return this.callback;
    }
    engage(objectData) {
        if (this.middleware) {
            return this.callback(this.middleware.run(objectData), this.lastRequestData);
        }
        return this.callback(objectData, this.lastRequestData);
    }
}
exports.default = Route;
