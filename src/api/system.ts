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

export function downloadFile(data?: object) {
  return request({
    url: '/api/admin/downloadFile',
    method: 'post',
    params: data
  })
}

export function importAuthorizeTemp(data?: object) {
  return request({
    url: '/api/admin/importAuthorizeTemp',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function importCustTemp(data?: object) {
  return request({
    url: '/api/admin/importCustTemp',
    method: 'post',
    data
  })
}