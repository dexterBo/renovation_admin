import request from '@/utils/system/request'

// 获取产品列表
export function getProductList(data: object) {
  return request({
    url: '/api/admin/queryProdPage',
    method: 'post',
    data
  })
}

// 添加色彩
export function addOrEdit(data: object) {
  return request({
    url: '/api/admin/addOrEditProd',
    method: 'post',
    data
  })
}