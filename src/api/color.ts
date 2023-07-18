import request from '@/utils/system/request'

// 获取数据api
export function getColorList(data: object) {
  return request({
    url: '/api/admin/queryColourPage',
    method: 'post',
    data
  })
}
