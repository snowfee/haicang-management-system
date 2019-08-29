import request from '@/utils/request'

export function memberList({ pageIndex, pageSize }) {
  return request({
    url: `/backend/member/queryMembers?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: 'get'
  })
}

export function allMembershipGrade() {
  return request({
    url: `/backend/member/queryAllMembershipGrade`,
    method: 'get'
  })
}

export function getMemberById(id) {
  return request({
    url: `/backend/member/getMemberById?id=${id}`,
    method: 'get'
  })
}

export function getMembershipGradeById(id) {
  return request({
    url: `/backend/member/getMembershipGradeById?id=${id}`,
    method: 'get'
  })
}

export function handleMember(data) {
  return request({
    url: `/backend/member/handleMember`,
    method: 'post',
    data
  })
}

export function feedbackList({ pageIndex, pageSize }) {
  return request({
    url: `/backend/member/feedbackList?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: 'get'
  })
}

export function handleMembershipGrade(data) {
  return request({
    url: `/backend/member/handleMembershipGrade`,
    method: 'post',
    data
  })
}

export function queryPointsProduct({ pageIndex, pageSize, name }) {
  return request({
    url: `/backend/member/queryPointsProduct?pageIndex=${pageIndex}&pageSize=${pageSize}&name=${name}`,
    method: 'get'
  })
}
