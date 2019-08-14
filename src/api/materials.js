import request from '@/utils/request'

export function queryMaterials(data) {
  return request({
    url: `/material/queryMaterials`,
    method: 'post',
    data
  })
}

export function handleMaterial(data) {
  return request({
    url: `/material/handleMaterial`,
    method: 'post',
    data
  })
}

export function getMaterialById(id) {
  return request({
    url: `/material/getMaterialById?materialId=${id}`,
    method: 'get'
  })
}

export function skuAttributeList() {
  return request({
    url: `/material/queryAllSkuAttribute`,
    method: 'get'
  })
}

export function handleSkuAttribute(data) {
  return request({
    url: `/material/handleSkuAttribute`,
    method: 'post',
    data
  })
}

export function handleSkuAttributeItem(data) {
  return request({
    url: `/material/handleSkuAttributeItem`,
    method: 'post',
    data
  })
}

export function getAttributeListById(id) {
  return request({
    url: `/material/querySkuAttributeItemByAttributeId?id=${id}`,
    method: 'get'
  })
}

export function unitsList() {
  return request({
    url: `/material/queryAllUnits`,
    method: 'get'
  })
}

export function handleUnit(data) {
  return request({
    url: `/material/handleUnit`,
    method: 'post',
    data
  })
}