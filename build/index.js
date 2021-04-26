"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const Router_1 = __importDefault(require("./server/Router"));
const router = new Router_1.default();
router.startServer();
router.addRoute(routes_1.importDocs());
router.addRoute(routes_1.insertDocs());
router.addRoute(routes_1.batchRequest(router.Routes));
