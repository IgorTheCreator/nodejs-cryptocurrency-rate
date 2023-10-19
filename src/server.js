import { createServer } from 'node:http';
import path from 'node:path';
import express from 'express';
import 'dotenv/config';
import WebSocket, { WebSocketServer } from 'ws';
import router from './routes/index.js';
import { subscribeToPair, unsubscribeToPair } from './utils/api.js';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.set('views', path.resolve('src', 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(router);

const server = createServer(app);
const wsServer = new WebSocketServer({ server });

wsServer.on('connection', (ws) => {
  ws.on('error', console.error);

  subscribeToPair();

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    const stringifiedMessage = JSON.stringify(parsedMessage);
    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(stringifiedMessage);
      }
    });
  });

  ws.on('close', () => {
    unsubscribeToPair();
  });
});

server.listen(3000, () => {
  console.log('Listening port 3000');
});
