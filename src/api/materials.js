import request from '@/utils/request'

export function queryMaterials(data) {
  return request({
    url: `/backend/material/queryMaterials`,
    method: 'post',
    data
  })
}

export function handleMaterial(data) {
  return request({
    url: `/backend/material/handleMaterial`,
    method: 'post',
    data
  })
}

export function getMaterialById(id) {
  return request({
    url: `/backend/material/getMaterialById?materialId=${id}`,
    method: 'get'
  })
}

export function skuAttributeList() {
  return request({
    url: `/backend/material/queryAllSkuAttribute`,
    method: 'get'
  })
}

export function handleSkuAttribute(data) {
  return request({
    url: `/backend/material/handleSkuAttribute`,
    method: 'post',
    data
  })
}

export function handleSkuAttributeItem(data) {
  return request({
    url: `/backend/material/handleSkuAttributeItem`,
    method: 'post',
    data
  })
}

export function getAttributeListById(id) {
  return request({
    url: `/backend/material/querySkuAttributeItemByAttributeId?attributeId=${id}`,
    method: 'get'
  })
}

export function unitsList() {
  return request({
    url: `/backend/material/queryAllUnits`,
    method: 'get'
  })
}

export function handleUnit(data) {
  return request({
    url: `/backend/material/handleUnit`,
    method: 'post',
    data
  })
}