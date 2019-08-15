import request from '@/utils/request'

export function productsList(data) {
  return request({
    url: `/backend/product/queryProducts`,
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

export function getCategoryDes(id) {
  return request({
    url: `/backend/product/getCategoryById?categoryId=${id}`,
    method: 'get'
  })
}