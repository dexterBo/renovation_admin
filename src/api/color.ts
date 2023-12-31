import request from '@/utils/system/request'

// 获取色彩列表
export function getColorList(data: object) {
  return request({
    url: '/api/admin/queryColourPage',
    method: 'post',
    data
  })
}

// 添加色彩
export function addOrEdit(data: object) {
  return request({
    url: '/api/admin/addOrEditColour',
    method: 'post',
    data
  })
}