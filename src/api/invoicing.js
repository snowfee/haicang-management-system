import request from '@/utils/request'

export function supplierList({ pageIndex, pageSize }) {
  return request({
    url: `/backend/invoicing/supplierList?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: 'get'
  })
}

export function handleSupplier(data) {
  return request({
    url: `/backend/invoicing/handleSupplier`,
    method: 'post',
    data
  })
}

export function getSupplierById(id) {
  return request({
    url: `/backend/invoicing/getSupplierById?id=${id}`,
    method: 'get'
  })
}

export function stockCheckList({ pageIndex, pageSize }) {
  return request({
    url: `/backend/invoicing/stockCheckList?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: 'get'
  })
}

export function handleStockCheck(data) {
  return request({
    url: `/backend/invoicing/handleStockCheck`,
    method: 'post',
    data
  })
}

export function stockCheckItemList(id) {
  return request({
    url: `/backend/invoicing/stockCheckItemList?id=${id}`,
    method: 'get'
  })
}

export function queryInventoryRecord(data) {
  return request({
    url: `/backend/invoicing/queryInventoryRecord`,
    method: 'post',
    data
  })
}

export function handleInventoryRecord(data) {
  return request({
    url: `/backend/invoicing/handleInventoryRecord`,
    method: 'post',
    data
  })
}

export function balanceStockCheckItem(data) {
  return request({
    url: `/backend/invoicing/balanceStockCheckItem`,
    method: 'post',
    data
  })
}

export function inventoryMainList({ pageIndex, pageSize }) {
  return request({
    url: `/backend/invoicing/productInventoryList?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: 'get'
  })
}