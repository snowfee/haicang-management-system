import request from '@/utils/request'

export function staffList({ pageIndex, pageSize }) {
  return request({
    url: `/backend/staff/staffList?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: 'get'
  })
}

export function roleList({ pageIndex, pageSize }) {
  return request({
    url: `/backend/staff/roleList?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: 'get'
  })
}

export function handleStaff(data) {
  return request({
    url: `/backend/staff/handleStaff`,
    method: 'post',
    data
  })
}

export function getStaffById(id) {
  return request({
    url: `/backend/staff/getStaffInfo?id=${id}`,
    method: 'get'
  })
}

export function allPermissions() {
  return request({
    url: `/backend/staff/allPermissions`,
    method: 'get'
  })
}

export function handleRole(data) {
  return request({
    url: `/backend/staff/handleRole`,
    method: 'post',
    data
  })
}

export function getRoleById(id) {
  return request({
    url: `/backend/staff/getRoleInfo?id=${id}`,
    method: 'get'
  })
}
