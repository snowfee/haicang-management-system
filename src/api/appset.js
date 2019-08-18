import request from '@/utils/request'

export function getHomeSections(name) {
  return request({
    url: `/backend/appSet/allHomeSections?name=${name}`,
    method: 'get'
  })
}

export function handleHomeSection(data) {
  return request({
    url: `/backend/appSet/handleHomeSection`,
    method: 'post',
    data
  })
}

export function getHomeSectionById(id) {
  return request({
    url: `/backend/appSet/getHomeSectionById?id=${id}`,
    method: 'get'
  })
}

export function handleBannerJump(data) {
  return request({
    url: `/backend/appSet/handleBannerJump`,
    method: 'post',
    data
  })
}

export function getBannerJump() {
  return request({
    url: `/backend/appSet/allHomeCarousels`,
    method: 'get'
  })
}

