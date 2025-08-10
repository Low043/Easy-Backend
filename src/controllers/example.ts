export default {
    async ping(req: Request) {
        return new Response('Pong');
    },

    async hello(req: Request) {
        throw new Error('Simulated error for testing purposes');

        const data = { message: 'Hello, world!' };
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    },
};
