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

export function handleStaff(params) {
  return request({
    url: `/staff/handleStaff`,
    method: 'post',
    
  })
}
