"use strict";

const fastify = require("fastify")();
fastify.register(require("fastify-websocket"));

fastify.get(
  "/",
  { websocket: true },
  (connection: any /* SocketStream */, req: any /* FastifyRequest */) => {
    connection.socket.on("message", (message: any) => {
      // message.toString() === 'hi from client'
      connection.socket.send(JSON.stringify("hi from server"));
    });
  },
);

fastify.listen(8000, (err: any) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
