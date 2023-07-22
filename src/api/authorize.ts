import request from '@/utils/system/request'

export function getAuthorizePassList(data: object) {
  return request({
    url: '/api/admin/queryAuthorizePassPage',
    method: 'post',
    data
  })
}

export function getAuthorizeList(data: object) {
  return request({
    url: '/api/admin/queryAuthorizePage',
    method: 'post',
    data
  })
}

export function pass(data: object) {
  return request({
    url: '/api/admin/passAuthorize',
    method: 'post',
    data
  })
}

export function add(data: object) {
  return request({
    url: '/api/admin/addAuthorize',
    method: 'post',
    data
  })
}