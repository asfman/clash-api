import 'isomorphic-fetch';

/**
 * Clash API
 * @docs https://clash.gitbook.io/doc/
 * @param {*} param0 
 */
export class Clash {
  constructor({ api, secret }) {
    this.api = api;
    this.secret = secret;
  }
  request(method, path, body) {
    const { api, secret } = this;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (secret) {
      headers['Authorization'] = `Bearer ${secret}`;
    }
    return fetch(api + path, {
      method,
      headers,
      body: body && JSON.stringify(body),
    })
  }
  /**
   * @docs https://clash.gitbook.io/doc/restful-api/common#获得当前的流量
   * @param {*} cb 
   */
  traffic() {
    return this.request('get', '/traffic');
  }
  /**
   * @docs https://clash.gitbook.io/doc/restful-api/common#获得实时日志
   * @param {*} level 
   * @param {*} cb 
   */
  logs(level) {
    return this.request('get', `/logs?level=${level}`);
  }
  /**
   * @docs https://clash.gitbook.io/doc/restful-api/proxies#获取所有代理
   */
  async proxies() {
    const response = await this.request('get', `/proxies`);
    const data = await response.json();
    return data.proxies;
  }
  /**
   * @docs https://clash.gitbook.io/doc/restful-api/proxies#获取单个代理信息
   * @param {*} name 
   */
  async proxy(name) {
    const response = await this.request('get', `/proxies/${name}`);
    const proxy = await response.json();
    return proxy;
  }
  /**
   * @docs https://clash.gitbook.io/doc/restful-api/proxies#获取单个代理的延迟
   * @param {*} name 
   * @param {*} url 
   * @param {*} timeout 
   */
  async delay(name, url = 'http://www.gstatic.com/generate_204', timeout = 2000) {
    const response = await this.request('get', `/proxies/${name}/delay?url=${url}&timeout=${timeout}`);
    const data = await response.json();
    // console.log(name, data);
    return data;
  }
  /**
   * @docs https://clash.gitbook.io/doc/restful-api/proxies#切换Selector中选中的代理
   * @param {*} selector 
   * @param {*} name 
   */
  async switch(selector, name) {
    const response = await this.request('put', `/proxies/${selector}`, { name })
    return response.status === 204;
  }
  /**
   * rules
   * @docs https://clash.gitbook.io/doc/restful-api/config#获取所有已经解析的规则
   */
  async rules() {
    const response = await this.request('get', '/rules');
    const data = await response.json();
    return data.rules;
  }
  async set_config() {
    const response = await this.request('PATCH', '/configs', conf);
    return response.status === 204;
  }
  async get_config() {
    const response = await this.request('get', '/configs');
    const configs = await response.json();
    return configs;
  }
  /**
   * https://clash.gitbook.io/doc/restful-api/config#获得当前的基础设置
   */
  config(conf) {
    if (conf) return this.set_config(conf);
    return this.get_config();
  }
}