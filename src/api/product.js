import request from '@/utils/request'

export function productsList(data) {
  return request({
    url: `/product/queryProducts`,
    method: 'post',
    data
  })
}

export function getAllCategories() {
  return request({
    url: `/product/allCategories`,
    method: 'get'
  })
}

export function handleCategory(data) {
  return request({
    url: `/product/handleCategory`,
    method: 'post',
    data
  })
}

export function getCategoryDes(id) {
  return request({
    url: `/product/getCategoryById?categoryId=${id}`,
    method: 'get'
  })
}

export function unitsList() {
  return request({
    url: `/material/queryAllUnits`,
    method: 'get'
  })
}
