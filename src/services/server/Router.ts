import type { Handler, Middleware, Method, Routes } from '../../types/server';

export default class Router {
    private routes: Routes = new Map();
    private middlewares: Middleware[] = [];
    private basePath: string;

    constructor(basePath: string = '/', ...middlewares: Middleware[]) {
        this.basePath = basePath;
        this.middlewares = middlewares;
    }

    public getRoutes() {
        return this.routes;
    }

    protected get(path: string, handler: Handler, ...middlewares: Middleware[]) {
        this.use(path, 'GET', handler, ...middlewares);
    }

    protected post(path: string, handler: Handler, ...middlewares: Middleware[]) {
        this.use(path, 'POST', handler, ...middlewares);
    }

    protected put(path: string, handler: Handler, ...middlewares: Middleware[]) {
        this.use(path, 'PUT', handler, ...middlewares);
    }

    protected delete(path: string, handler: Handler, ...middlewares: Middleware[]) {
        this.use(path, 'DELETE', handler, ...middlewares);
    }

    private use(path: string, method: Method, handler: Handler, ...middlewares: Middleware[]) {
        const routeKey = `${method} ${this.basePath}${path}`;

        this.routes.set(routeKey, [handler, ...this.middlewares, ...middlewares]);
    }
}
