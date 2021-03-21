/* eslint-disable */
import { importDocs, insertDocs } from './routes';
import Router from './server/Router';

const router: Router = new Router();
router.startServer();
router.addRoute(importDocs(router));
router.addRoute(insertDocs(router));