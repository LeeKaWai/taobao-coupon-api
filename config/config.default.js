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
    appkey: '24781052',
    appsecret: 'c2b30c8394e7af7ff8cf9e3729c431dd',
    REST_URL: 'https://eco.taobao.com/router/rest',
    pid: 'mm_121951692_42196389_206786066',
    siteid: '42196389',
    adzoneid: '206786066'
  };
    
  return {
    ...config
  }
};
