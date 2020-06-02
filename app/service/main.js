'use strict'

const { isTpwd, isURL} = require('../util/tools');

const Service = require('egg').Service


/**
 * 业务逻辑
 */
class MainService extends Service { 

  /**
   * 淘宝商品优惠券搜索
   * @param {Object} query  查询
   * @param {String} query.q  查询条件 (支持关键词、淘口令、商品链接)
   */
  async search (query) {
    let result = null;
    if (isTpwd(query.q).length>0) {
      result = await this.search_tpwd(query);
    }
    else if (isURL(query.q)) {
      result = await this.search_url(query);
    }
    else { 
      result = await this.search_title(query.q);
    }
    return result;
  }

  /**
   * 根据淘口令查询优惠券
   * @param {Object} query 查询条件
   * @param {String} query.q  淘口令
   */
  async search_tpwd (query) {
    const { ctx } = this;
    const tpwd = await ctx.service.taobao.tpwd_query(query.q)
    if (tpwd.suc === false || tpwd.sub_code) { 
      return {
        status: 500,
        message:'淘口令转出错,请稍后再试～',
        content:null
      }
    }
    // 解析淘口令之后,再通过商品链接获取淘宝商品id
    return await this.search_url({ q: tpwd.url });
  }

  /**
   * 根据商品id查询优惠券
   * @param {Object} query    查询条件
   * @param {String} query.q   商品id
   */
  async search_id (query) { 
    const { ctx } = this;
   
    // 查询该商品是否加入淘宝客推广
    const item_info = await ctx.service.taobao.item_info(query.q);
    
    // 如果该商品没有加入淘宝客推广, 就用商品标题来查询相似的商品
    if (item_info.code) { 
     
    }
    // 通过【相同标题】查询相同标题并加入推广的商品
    const item_list = await this.search_title({
      q: item_info[0].title,
      has_coupon: false,
      page_size: 100
    });

    // 根据商品id去筛选出该商品的优惠券信息
    const item_result = item_list.filter(
      r => r.item_id.toString() === item_info[0].num_iid.toString()
    );

    if (item_result.length > 0) {
      const item = item_result[0];
      let coupon_url = `https:${item.coupon_share_url !== undefined ? item.coupon_share_url : item.url}`
      const promise_list = [];
      const create_tpwd = await ctx.service.taobao.tpwd_create(
        item.title,
        coupon_url
      );
      const result = {
        ...item,
        coupon_url,
        tpwd: create_tpwd,
        zk_final_price: Number.parseFloat(item.zk_final_price),
        // 优惠券金额
        coupon_amount: item.coupon_amount === undefined ? 0 : Number.parseFloat(item.coupon_amount),
        // 推广链接,如存在优惠券，就是二合一链接，否则就是普通推广链接
        coupon_click_url: coupon_url,
        // 商品小图
        small_images: item.small_images.String,
        // 佣金比例
        commission_rate: item.commission_rate / 10000,
        // 券后价
        quanhou_jiage: Number.parseFloat(item.zk_final_price) - (item.coupon_amount === undefined ? 0 : Number.parseFloat(item.coupon_amount))
      }

      return {
        status: 200,
        content: [
          result
        ]
      }
    }
    return {
      status: 500,
      message:'sorry，找不到任何商品'
    }
  }

  /**
   * 根据商品url查询优惠券
   * @param {Object} query  查询条件
   * @param {String} query.q  商品网址
   */
  async search_url (query) {
    const item_ids = query.q.match('(?<=/?id=|&id=|/i)[^&|.htm]+');
    if (item_ids.length > 0) { 
      const result = await this.search_id({ q: item_ids[0]});
      return result
    }
    return {
      status: 500,
      message:'sorry,找不到对应的商品,请检查一下网址是否输入正确!'
    }
  }

  /**
   * 根据关键词查询优惠券
   * @param {Object} query   查询条件
   * @param {String} query.q   关键词
   */
  async search_title (query) { 
    const result = await this.ctx.service.taobao.material_optional(query);
    return result;
  }
}
module.exports = MainService;