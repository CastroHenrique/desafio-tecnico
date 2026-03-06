"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const node_http_1 = require("node:http");
const server = new node_http_1.Server(app_js_1.app);
const port = process.env.SERVER_OUTPUT_PORT;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = server;
