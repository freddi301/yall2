import { createServer } from "http";
const handler = require("./index"); //tslint:disable-line

createServer(handler).listen(8080);
