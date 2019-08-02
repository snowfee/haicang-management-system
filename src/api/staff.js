import request from '@/utils/request'

export function staffList({ pageIndex, pageSize }) {
  return request({
    url: `/staff/staffList?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: 'get'
  })
}

export function roleList({ pageIndex, pageSize }) {
  return request({
    url: `/staff/roleList?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: 'get'
  })
}

export function handleStaff(data) {
  return request({
    url: `/staff/handleStaff`,
    method: 'post',
    data
  })
}

export function getStaffById(id) {
  return request({
    url: `/staff/getStaffInfo?id=${id}`,
    method: 'get'
  })
}

export function allPermissions() {
  return request({
    url: `/staff/allPermissions`,
    method: 'get'
  })
}

export function handleRole(data) {
  return request({
    url: `/staff/handleRole`,
    method: 'post',
    data
  })
}
