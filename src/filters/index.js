export function keyToDes(key) {
  let des = ''
  switch (key) {
    case 'MALE': des = '男'
      break
    case 'FEMALE': des = '女'
      break
    case 'SHELVE': des = '上架'
      break
    case 'UNSHELVE': des = '下架'
      break
    case 'DISCOUNT': des = '折扣'
      break
    case 'FULL_MINUS': des = '满减'
      break
    case 'VOUCHER': des = '代金券'
      break
    case 'UNCHECKED': des = '未审核'
      break
    case 'CHECKED': des = '已审核'
      break
    case 'NOT_PAID': des = '未支付'
      break
    case 'EXPIRED': des = '订单过期'
      break
    case 'PAID': des = '已支付待配送'
      break
    case 'DELIVERY': des = '派送中'
      break
    case 'SUCCESS': des = '订单完成'
      break
    //  结算方式
    case 'CASH_ON_DELIVERY': des = '货到付款'
      break
    case 'DAILY': des = '日结'
      break
    case 'MONTHLY': des = '月结'
      break
    case 'ONCREDIT': des = '挂账'
      break
    // 盘点类型
    case 'WEEKLY': des = '周结'
      break
    case 'SUPPLIER': des = '供应商'
      break
    case 'MEMBER': des = '商户'
      break
    case 'OTHER': des = '其他'
      break
    case 'WECHAT': des = '微信支付'
      break
    case 'ALIPAY': des = '支付宝'
      break
    case 'CASH': des = '现金支付'
      break
    case 'ACTIVITY': des = '活动'
      break
    case 'CATEGORY': des = '类目'
      break
    case 'PRODUCT_LIST': des = '商品列表'
      break
    case 'PRODUCT_BINARY': des = '商品二分'
      break
    case 'SNAP_UP': des = '抢购'
      break
    case 'GET_COUPON': des = '领券'
      break
    case 'COUPON_CENTER': des = '领券中心'
      break
    case 'WEBPAGE': des = '网页链接'
      break
    case 'PRODUCT': des = '商品'
      break
    case 'NO_JUMP': des = '不跳转'
      break
    case 'HOME_SECTION': des = '首页模块'
      break
    case 'SECOND_Category': des = '二级类目的banner'
      break
    case 'HOME_CAROUSEL': des = '首页轮播图'
      break
    case 'SINGLE': des = '单个物料'
      break
    case 'MULTI': des = '组合物料'
      break
  }
  return des
}
