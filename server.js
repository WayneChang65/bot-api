const http = require('http');
const app = require('./app.js');

const port = process.env.BOT_API_PORT || 3333;
const server = http.createServer(app);

server.listen(port);