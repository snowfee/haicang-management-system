import request from '@/utils/request'

export function getHomeOrder(data) {
  return request({
    url: `/backend/home/queryHomeOrder`,
    method: 'post',
    data
  })
}

export function handleHomeOrder(data) {
  return request({
    url: `/backend/home/handleHomeOrder`,
    method: 'post',
    data
  })
}

export function getPrintParams(key) {
  return request({
    url: `/backend/system/paramSetting/${key}`,
    method: 'get'
  })
}
