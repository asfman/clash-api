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
    /**
     * @docs https://clash.gitbook.io/doc/restful-api/common#获得当前的流量
     * @param {*} cb 
     */
    async traffic(cb) {
      const response = await request('get', '/traffic');
      response.on('data', chunk => cb(JSON.parse(chunk)));
      return this;
    },
    /**
     * @docs https://clash.gitbook.io/doc/restful-api/common#获得实时日志
     * @param {*} level 
     * @param {*} cb 
     */
    async logs(level, cb) {
      const response = await request('get', `/logs?level=${level}`);
      response.on('data', chunk => cb(JSON.parse(chunk)));
      return this;
    },
    /**
     * @docs https://clash.gitbook.io/doc/restful-api/proxies#获取所有代理
     */
    proxies() {
      return Promise
        .resolve()
        .then(() => request('get', `/proxies`))
        .then(readStream)
        .then(JSON.parse)
        .then(data => data.proxies)
    },
    /**
     * @docs https://clash.gitbook.io/doc/restful-api/proxies#获取单个代理信息
     * @param {*} name 
     */
    proxy(name) {
      return Promise
        .resolve()
        .then(() => request('get', `/proxies/${name}`))
        .then(readStream)
        .then(JSON.parse)
    },
    /**
     * @docs https://clash.gitbook.io/doc/restful-api/proxies#获取单个代理的延迟
     * @param {*} name 
     * @param {*} url 
     * @param {*} timeout 
     */
    delay(name, url = 'http://www.gstatic.com/generate_204', timeout = 2000) {
      return Promise
        .resolve()
        .then(() => request('get', `/proxies/${name}/delay?url=${url}&timeout=${timeout}`))
        .then(readStream)
        .then(JSON.parse)
    },
    /**
     * @docs https://clash.gitbook.io/doc/restful-api/proxies#切换Selector中选中的代理
     * @param {*} selector 
     * @param {*} name 
     */
    switch(selector, name) {
      return Promise
        .resolve()
        .then(() => request('put', `/proxies/${selector}`, { name }))
        .then(async res => {
          if (res.statusCode === 204) return true;
          const response = await readStream(res);
          const { error } = JSON.parse(response);
          throw new Error(error);
        });
    },
    /**
     * rules
     * @docs https://clash.gitbook.io/doc/restful-api/config#获取所有已经解析的规则
     */
    rules() {
      return Promise
        .resolve()
        .then(() => request('get', '/rules'))
        .then(readStream)
        .then(JSON.parse)
        .then(data => data.rules)
    },
    /**
     * https://clash.gitbook.io/doc/restful-api/config#获得当前的基础设置
     */
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