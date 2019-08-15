import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/backend/staff/login',
    method: 'post',
    data
  })
}

export function getInfo(id) {
  return request({
    url: `/backend/staff/getStaffInfo?id=${id}`,
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

export function getQiniuUpToken() {
  return request({
    url: `member/genQiniuUpToken`,
    method: 'get'
  })
}