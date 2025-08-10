import type { Handler } from '../../types/server';

export default function logger(req: Request, next: Handler) {
    const method = req.method;
    const url = new URL(req.url);
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${method} ${url.pathname}`);

    return next(req);
}
