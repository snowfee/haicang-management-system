import request from '@/utils/request'

export function productsList(data) {
  return request({
    url: `/backend/product/queryProducts`,
    method: 'post',
    data
  })
}

export function handleProduct(data) {
  return request({
    url: `/backend/product/handleProduct`,
    method: 'post',
    data
  })
}

export function handleCoupon(data) {
  return request({
    url: `/backend/product/handleCoupon`,
    method: 'post',
    data
  })
}

export function couponList(data) {
  return request({
    url: `/backend/product/queryCoupons`,
    method: 'post',
    data
  })
}

export function getAllCategories() {
  return request({
    url: `/backend/product/allCategories`,
    method: 'get'
  })
}

export function handleCategory(data) {
  return request({
    url: `/backend/product/handleCategory`,
    method: 'post',
    data
  })
}

export function getCategoryById(id) {
  return request({
    url: `/backend/product/getCategoryById?categoryId=${id}`,
    method: 'get'
  })
}

export function getCouponById(id) {
  return request({
    url: `/backend/product/getCouponById?couponId=${id}`,
    method: 'get'
  })
}
