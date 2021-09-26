'use strict';
const http = require('http');
const app = require('./app.js');
const fmlog = require('@waynechang65/fml-consolelog').log;

const server = http.createServer(app);

server.listen(process.env.BOT_API_PORT || 3333, () => {
    fmlog('sys_msg', ['BOT-API', `The server is running on port ${server.address().port}.`]);
});