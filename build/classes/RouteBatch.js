"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(require("../server/Route"));
class RouteBatch extends Route_1.default {
    constructor(path, callback, restrictedRoutes, middleware, 
    // prevent duplicates of requests
    lastRequestData = '') {
        super(path, callback, middleware, lastRequestData);
        this.restrictedRoutes = [];
        this.restrictedRoutes = restrictedRoutes;
    }
    get RestrictedRoutes() {
        return this.restrictedRoutes;
    }
}
exports.default = RouteBatch;
