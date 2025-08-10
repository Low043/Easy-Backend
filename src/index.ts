import Server from './services/server';
import path from 'path';

const server = new Server({
    port: process.env.PORT || 3000,
    routesDir: path.join(__dirname, 'routes'),
    globalMiddlewaresDir: path.join(__dirname, 'middlewares', 'public'),
    https: {
        cert: Bun.file(path.join(__dirname, 'config', 'cert.pem')),
        key: Bun.file(path.join(__dirname, 'config', 'key.pem')),
    },
});

server.run();
