'use strict';
const Controller = require('egg').Controller;

class TaoBaoController extends Controller { 
  /**
   * 超级搜索
   */
  async search () { 
    const { ctx } = this;
    const result = await ctx.service.main.search(ctx.query)
    ctx.body = result;
  }
}
module.exports = TaoBaoController;