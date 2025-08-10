import ExampleController from '../controllers/example';
import Router from '../services/server/Router';

export default class ExampleRouter extends Router {
    constructor() {
        super('/example');
        this.get('/ping', ExampleController.ping);
        this.get('/hello', ExampleController.hello);
    }
}
