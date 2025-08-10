import type { ServerOptions, Middleware, Routes } from '../../types/server';
import { Glob } from 'bun';
import path from 'path';

export default class Server {
    private bunServer: Bun.Server | undefined;
    private routes: Routes = new Map();
    private middlewares: Middleware[] = [];
    private options: ServerOptions;

    constructor(options: ServerOptions) {
        this.options = options;
    }

    public async run() {
        await this.loadGlobalMiddlewares();
        await this.loadRoutes();

        this.bunServer = Bun.serve({
            port: this.options.port,
            tls: this.options.https,
            fetch: this.fetch.bind(this),
            error: this.error.bind(this),
        });

        console.log(`Server running on ${this.bunServer.url}`);
    }

    private async loadGlobalMiddlewares() {
        if (!this.options.globalMiddlewaresDir) return;

        const glob = new Glob(`${this.options.globalMiddlewaresDir}\\**\\*.{ts,js}`);

        for await (const file of glob.scan('.')) {
            const MiddlewareModule = await import(path.resolve(process.cwd(), file));
            const middlewareHandler = MiddlewareModule.default;
            if (!middlewareHandler) continue;

            this.middlewares.push(middlewareHandler as Middleware);
        }
    }

    private async loadRoutes() {
        const glob = new Glob(`${this.options.routesDir}\\**\\*.{ts,js}`);

        for await (const file of glob.scan('.')) {
            const RouterModule = await import(path.resolve(process.cwd(), file));
            const RouterClass = RouterModule.default;
            if (!RouterClass) continue;

            const routerInstance = new RouterClass();
            const newRoutes = routerInstance.getRoutes() as Routes;

            for (const [key, [handler, ...middlewares]] of newRoutes.entries()) {
                if (this.routes.has(key)) {
                    console.warn(`Overwriting existing route: ${key} with new handler on ${file}`);
                }
                this.routes.set(key, [handler, ...this.middlewares, ...middlewares]);
            }
        }
    }

    private fetch(req: Request) {
        const url = new URL(req.url);
        const routeKey = `${req.method} ${url.pathname}`;

        const route = this.routes.get(routeKey);
        if (!route) return new Response('Not Found', { status: 404 });

        let [handler, ...middlewares] = route;

        for (const middleware of middlewares) {
            handler = middleware.bind(null, req, handler);
        }

        return handler(req);
    }

    private error(error: Error) {
        console.error('Server Error:', error);
        return new Response(error.message || 'Internal Server Error', { status: 500 });
    }
}
