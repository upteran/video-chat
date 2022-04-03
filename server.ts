import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";

const server: FastifyInstance = Fastify({});

const portNumber = 3000;
const sourceDir = "dist";

// Declare a route
// server.get("/", async (request: IncomingMessage, reply: ServerResponse) => {
//   return { hello: "world" };
// });

// app.use(server.static(sourceDir));

// Run the server!
const start = async (): Promise<void> => {
  try {
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
