import WebSocket from 'ws';

const ws = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${process.env.API_KEY}`
);
const ourWSServer = new WebSocket('ws://localhost:3000/');

const AGGREGATE_INDEX = '5';

const HEADER = {
  action: 'SubAdd',
  subs: ['5~CCCAGG~BTC~USD'],
};

const UNSUB_HEADER = {
  action: 'SubRemove',
  subs: ['5~CCCAGG~BTC~USD'],
};

ws.on('message', (data) => {
  const {
    TYPE: type,
    FROMSYMBOL: fromCurrency,
    TOSYMBOL: toCurrency,
    PRICE: price,
  } = JSON.parse(data);
  if (type !== AGGREGATE_INDEX || price === undefined) {
    return;
  }
  const dataForClient = { fromCurrency, toCurrency, price };
  ourWSServer.send(JSON.stringify(dataForClient));
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

const unsubscribeToPairOnWs = (message) => {
  const stringifiedMessage = JSON.stringify(message);
  ws.send(stringifiedMessage);
};

export const subscribeToPair = () => {
  subscribeToPairOnWs(HEADER);
};

export const unsubscribeToPair = () => {
  unsubscribeToPairOnWs(UNSUB_HEADER);
};
