import { batchRequest, importDocs, insertDocs } from './routes';
import Router from './server/Router';

const router: Router = new Router();
router.startServer();
router.addRoute(importDocs());
router.addRoute(insertDocs());
router.addRoute(batchRequest(router.Routes));
