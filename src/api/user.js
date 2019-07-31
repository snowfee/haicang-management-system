import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/staff/login',
    method: 'post',
    data
  })
}

export function getInfo(id) {
  return request({
    url: `/staff/getStaffInfo?id=${id}`,
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
