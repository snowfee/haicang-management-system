import request from '@/utils/request'

export function memberList({ pageIndex, pageSize }) {
  return request({
    url: `/backend/member/queryMembers?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: 'get'
  })
}

export function AllMembershipGrade() {
  return request({
    url: `/backend/member/queryAllMembershipGrade`,
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
