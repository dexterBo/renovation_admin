import request from '@/utils/system/request'

export function getQiniuToken(data?: object) {
  return request({
    url: '/api/user/qiniuUploadToken',
    method: 'get',
    data
  })
}

export function getQiniuResourcesUrl(data?: object) {
  return request({
    url: '/api/user/qiniuResourcesUrl',
    method: 'get',
    data
  })
}
