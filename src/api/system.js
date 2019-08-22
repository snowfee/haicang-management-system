import request from '@/utils/request'

export function queryMessageCenter(data) {
  return request({
    url: `/backend/system/queryMessageCenter?title=${data.title}&pageIndex=${data.pageIndex}&pageSize=${data.pageSize}`,
    method: 'get',
  })
}

export function paramSettingList() {
  return request({
    url: `/backend/system/paramSettingList`,
    method: 'get'
  })
}

export function handleMessageCenter(data) {
  return request({
    url: `/backend/system/handleMessageCenter`,
    method: 'post',
    data
  })
}

export function handleParamSetting(data) {
  return request({
    url: `/backend/system/handleParamSetting`,
    method: 'post',
    data
  })
}

