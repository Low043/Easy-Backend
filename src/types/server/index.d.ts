import type { BunFile } from 'bun';

export interface ServerOptions {
    port: string | number;
    https?: { cert: BunFile; key: BunFile };
    globalMiddlewaresDir?: string;
    routesDir: string;
}

// A Handler is a function that takes a Request and returns a Response (Controller)
export type Handler = (req: Request) => Response | Promise<Response>;

// A Middleware is a function that extends the behavior of a handler (can be used in chain)
export type Middleware = (req: Request, next: Handler) => Response | Promise<Response>;

// Allowed HTTP methods
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

// A Route is a mapping of a path to a handler and its middlewares
// Can be viewed using console.log(this.getRoutes()) on Server or Routers
export type Routes = Map<string, [Handler, ...Middleware[]]>;
