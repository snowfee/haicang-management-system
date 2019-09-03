import request from '@/utils/request'

export function queryRevenueProfile(query) {
  return request({
    url: `/backend/report/revenueProfile?${query}`,
    method: 'get'
  })
}

export function queryOrderList(query) {
  return request({
    url: `/backend/report/orderList?${query}`,
    method: 'get'
  })
}

export function queryBillSummary(query) {
  return request({
    url: `/backend/report/billSummary?${query}`,
    method: 'get'
  })
}

export function queryProductReport(query) {
  return request({
    url: `/backend/report/productReport?${query}`,
    method: 'get'
  })
}

export function queryFinanceForCoupon(query) {
  return request({
    url: `/backend/report/financeForCoupon?${query}`,
    method: 'get'
  })
}

export function queryFinanceForCredit(query) {
  return request({
    url: `/backend/report/financeForCredit?${query}`,
    method: 'get'
  })
}

export function queryFinanceForRevenue(query) {
  return request({
    url: `/backend/report/financeForRevenue?${query}`,
    method: 'get'
  })
}

export function queryOrderForInterval(query) {
  return request({
    url: `/backend/report/orderForInterval?${query}`,
    method: 'get'
  })
}

export function queryOrderForRegion(query) {
  return request({
    url: `/backend/report/orderForRegion?${query}`,
    method: 'get'
  })
}

export function queryOrderForReturn(query) {
  return request({
    url: `/backend/report/orderForReturn?${query}`,
    method: 'get'
  })
}

export function queryPaymentFlow(query) {
  return request({
    url: `/backend/report/paymentFlow?${query}`,
    method: 'get'
  })
}
