// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const path = require("path");

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "dist"),
  prefix: "/dist/", // optional: default '/'
});

fastify.get("/", function (req, reply) {
  reply.sendFile("index.html"); // serving path.join(__dirname, 'public', 'myHtml.html') directly
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
