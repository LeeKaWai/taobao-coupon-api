'use strict';
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index () { 
    const { ctx } = this;
    ctx.type = 'text/html;charset=utf-8';
    ctx.body = 'hi,欢迎使用淘宝客优惠券api,如果您觉得这个项目不错，请给我一个star吧! 欢迎访问我的个人站<a href="https://esoquan.com">易搜券</a>';
  }
}

module.exports = HomeController;