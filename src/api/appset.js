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



