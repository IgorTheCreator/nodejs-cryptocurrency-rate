import http from 'node:http';
import path from 'node:path';
import express from 'express';
import 'dotenv/config';
import router from './routes/index.js';

const app = express();

app.set('views', path.resolve('src', 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(router);

const server = http.createServer(app);
server.listen(3000);
