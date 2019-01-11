const { createServer } = require("http");

const handler = require("./run.js").default;

createServer(handler).listen(8080);
