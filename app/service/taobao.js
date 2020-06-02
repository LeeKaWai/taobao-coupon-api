'use strict'

const Service = require('egg').Service;
const TopClient = require('node-taobao-topclient').default;


/**
 * 淘宝客api
 */
class TaobaoService extends Service{
  constructor (ctx) {
    super(ctx);
    const client = new TopClient({
      appkey: this.app.config.taobao.appkey,
      appsecret: this.app.config.taobao.appsecret,
      REST_URL: this.app.config.taobao.REST_URL
    });
    ctx.client = client;
  }


  /**
   * 淘宝客商品详情查询（简版）
   * @description 只有参加了淘宝客推广的商品才能查询到商品信息
   * @param {String} item_id   商品ID串, 用, 分割， 最大40个
   * @param {Number} platform  链接形式：1:pc， 2:无线，默认:1
   */
  async item_info (item_id, platform = 1) { 
    try {
      const result = await this.ctx.client.execute('taobao.tbk.item.info.get', {
        num_iids: item_id,
        platform
      });
      if (result.results.n_tbk_item) {
        return result.results.n_tbk_item;
      }
      return result;
    } catch (error) { 
      return error;
    }
  }


  /**
   * 通用物料搜索API（导购）
   * @param {Object} query            查询条件
   * @param {Number}  query.adzone_id           mm_xxx_xxx_12345678三段式的最后一段数字
   * @param {String}  query.q                   关键词
   * @param {String}  query.has_coupon          优惠券筛选-是否有优惠券。true表示该商品有优惠券，false或不设置表示不限
   * @param {Boolean} query.need_free_shipment  商品筛选-是否包邮。true表示包邮，false或不设置表示不限
   * @param {Number}  query.page_size           页大小，默认20，1~100
   * @param {Number}  query.page_no             第几页，默认：１
   * @param {Boolean} query.is_tmall            商品筛选-是否天猫商品。true表示属于天猫商品，false或不设置表示不限
   * @param {Boolean} query.is_overseas         商品筛选-是否海外商品。true表示属于海外商品，false或不设置表示不限
   * @param {Number}  query.start_price         商品筛选-折扣价范围下限。单位：元
   * @param {Number}  query.end_price           商品筛选-折扣价范围上限。单位：元
   * @param {Number}  query.start_tk_rate       商品筛选-淘客佣金比率下限。如：1234表示12.34%
   * @param {Number}  query.end_tk_rate         商品筛选-淘客佣金比率上限。如：1234表示12.34%
   * @param {String}  query.sort                排序_des（降序），排序_asc（升序），销量（total_sales），淘客佣金比率（tk_rate）， 累计推广量（tk_total_sales），总支出佣金（tk_total_commi），价格（price）
   * @param {String}  query.cat                 商品筛选-后台类目ID
   * @param {Number}  query.material_id         不传时默认物料id=2836；如果直接对消费者投放，可使用官方个性化算法优化的搜索物料id=17004
   * @param {Boolean} query.need_prepay         商品筛选-是否加入消费者保障。true表示加入，false或不设置表示不限
   */
  async material_optional (query) { 
    try {
      query.adzone_id = this.app.config.taobao.adzoneid
      const result = await  this.ctx.client.execute(
        'taobao.tbk.dg.material.optional', {
        ...query
      });
      return result.result_list.map_data;
    } catch (error) { 
      return error
    }
  }


  /**
   * 生成淘宝客淘口令
   * @description 提供淘客生成淘口令接口，淘客提交口令内容、logo、url等参数，生成淘口令关键key如：￥SADadW￥，后续进行文案包装组装用于传播
   * @param {String}  text  口令弹框内容
   * @param {String}  url   口令跳转目标页
   */
  async tpwd_create (text, url) { 
    try {
      const result = await this.ctx.client.execute('taobao.tbk.tpwd.create', {
        user_id: '123',
        text,
        url
      });
      return result.data.model
    } catch (error) {
      return error;
    }
  }

  /**
   * 查询解析淘口令
   * @description  解析淘口令 获取淘宝商品链接
   * @param {String} password_content   淘口令
   */
  async tpwd_query (password_content) { 
     try {
      const result = await this.ctx.client.execute(
        'taobao.wireless.share.tpwd.query', {
          password_content
        }
      );
      return result;
    } catch (error) {
      return error;
    }
  }
};

module.exports = TaobaoService;