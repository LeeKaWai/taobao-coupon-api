/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

 config.security = {
    csrf: {
      enable: false,
      ignoreJSON: false
    },
    domainWhiteList: ['*']
  };


  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1554129454231_6665';

  
  config.taobao = {
    appkey: '',
    appsecret: '',
    REST_URL: 'https://eco.taobao.com/router/rest',
    pid: '',
    siteid: '',
    adzoneid: ''
  };
    
  return {
    ...config
  }
};
