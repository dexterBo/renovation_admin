import request from '@/utils/system/request'

export function getClientList(data: object) {
  return request({
    url: '/api/admin/queryCustPage',
    method: 'post',
    data
  })
}

// 添加色彩
export function addOrEdit(data: object) {
  return request({
    url: '/api/admin/addOrEditCust',
    method: 'post',
    data
  })
}