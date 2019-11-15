const http = require('http');

const readStream = stream => new Promise((resolve, reject) => {
  const buffer = [];
  stream
    .on('error', reject)
    .on('data', chunk => buffer.push(chunk))
    .on('end', () => resolve(Buffer.concat(buffer)))
});
/**
 * Clash API
 * @docs https://clash.gitbook.io/doc/
 * @param {*} param0 
 */
const Clash = ({ api, secret }) => {
  const request = (method, path, params = {}) => {
    const headers = {
      Authorization: `Bearer ${secret}`
    };
    return new Promise((resolve, reject) => {
      const req = http.request(api + path, {
        method,
        headers
      }, resolve);
      req.end(JSON.stringify(params));
    });
  };
  return {
    async traffic(cb) {
      const response = await request('get', '/traffic');
      response.on('data', chunk => cb(JSON.parse(chunk)));
      return this;
    },
    async logs(level, cb) {
      const response = await request('get', `/logs?level=${level}`);
      response.on('data', chunk => cb(JSON.parse(chunk)));
      return this;
    },
    proxies() {
      return Promise
        .resolve()
        .then(() => request('get', `/proxies`))
        .then(readStream)
        .then(JSON.parse)
        .then(data => data.proxies)
    },
    proxy(name) {
      return Promise
        .resolve()
        .then(() => request('get', `/proxies/${name}`))
        .then(readStream)
        .then(JSON.parse)
    },
    delay(name, url = 'http://www.gstatic.com/generate_204', timeout = 2000) {
      return Promise
        .resolve()
        .then(() => request('get', `/proxies/${name}/delay?url=${url}&timeout=${timeout}`))
        .then(readStream)
        .then(JSON.parse)
    },
    switch(name) {
      return Promise
        .resolve()
        .then(() => request('put', `/proxies/${name}`, { name }))
        .then(readStream)
        .then(JSON.parse)
    },
    rules() {
      return Promise
        .resolve()
        .then(() => request('get', '/rules'))
        .then(readStream)
        .then(JSON.parse)
        .then(data => data.rules)
    },
    config() {
      return Promise
        .resolve()
        .then(() => request('get', '/configs'))
        .then(readStream)
        .then(JSON.parse)
    }
  };
};

module.exports = Clash;