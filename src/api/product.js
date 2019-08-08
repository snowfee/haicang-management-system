import request from '@/utils/request'

export function queryMaterials(data) {
  return request({
    url: `/material/queryMaterials`,
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

export function unitsList() {
  return request({
    url: `/material/queryAllUnits`,
    method: 'get'
  })
}