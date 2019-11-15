const Clash = require('..');

const clash = Clash({
  secret: 'song940@163.com',
  api: 'http://lsong.me:9090'
});

clash.traffic(({ up, down }) => {
  console.log('traffic: up:%i; down:%i', up, down);
});

clash.logs('debug', ({ type, payload }) => {
  console.log('log', type, payload);
});

// (async () => {

//   const proxies = await clash.proxies();
//   console.log(proxies);

//   const name = 'ss-ru1';

//   const proxy = await clash.proxy(name);
//   console.log(proxy);

//   const delay = await clash.delay(name);
//   console.log('delay', delay);

//   const rules = await clash.rules();
//   console.log(rules);

//   const config = await clash.config();
//   console.log(config);

//   const result = await clash.switch('auto');
//   console.log(result);

// })();