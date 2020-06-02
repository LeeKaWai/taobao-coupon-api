'use strict';


/**
 * 验证是否url地址
 * @param {String} url 网址
 */
const isURL = (url) => {
    return /^http[s]?:\/\/.*/.test(url)
}


/**
 * 验证是否是淘口令
 */
const symbolArray = ['€', '￥', '₳', '₴', '¢', '₤', '(', ')', '$', '💰', '￥￥', '£'];
const isTpwd = (content) => {
 return symbolArray.filter(n => { return content.indexOf(n) > -1 })
}

module.exports = {
  isURL,
  isTpwd
}