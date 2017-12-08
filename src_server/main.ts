#!/usr/bin/env node
/**
 * !Shebang line needed for npm to create linux/windows links to node!
 */

import * as Http from 'http';

import { ExpressServerApp } from './express.app';
import { SocketServer } from './socketServer';

const defaultPort = 8988;
// create express app
const expressApp = new ExpressServerApp(defaultPort);
// create Http.Server
const server = Http.createServer(expressApp.getApp());
const socketServer = new SocketServer(server);

// start server
server.listen(expressApp.port, () => {
    console.log(expressApp.getStartMessage());
});
