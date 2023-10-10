import WebSocket from 'ws';

const ws = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${process.env.API_KEY}`
);
const ourWSServer = new WebSocket('ws://localhost:3000/');

const TICKER = '2';

const header = {
  action: 'SubAdd',
  subs: ['2~Binance~BTC~USDT'],
};

ws.on('message', (data) => {
  const { TYPE: type, FROMSYMBOL: currency, PRICE: price } = JSON.parse(data);
  if (type !== TICKER || price === undefined) {
    return;
  }
  const obj = { type, currency, price };
  ourWSServer.send(JSON.stringify(obj));
});

const subscribeToPairOnWs = (message) => {
  const stringifiedMessage = JSON.stringify(message);

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(stringifiedMessage);
    return;
  }

  ws.once('open', () => {
    ws.send(stringifiedMessage);
  });
};

export const subscribeToPair = () => {
  subscribeToPairOnWs(header);
};
