import { Clash } from '../index.js'

const clash = new Clash({
  secret: 'song940@163.com',
  api: 'http://clash.lsong.one:8888'
});

(async () => {
  const proxies = await clash.proxies();
  console.log('proxies', proxies);
})();

clash.traffic(({ up, down }) => {
  console.log('traffic: up: %i; down: %i', up, down);
});

clash.logs('debug', ({ type, payload }) => {
  console.log('log', type, payload);
});