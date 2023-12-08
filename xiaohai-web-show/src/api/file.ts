import request from '@/utils/axios'

const api = '/file'

export const uploadImage = (data: any) => {
  return request({
    url: `${api}/upload`,
    method: 'post',
    data
  })
}

export const deleteImage = (data: any) => {
  return request({
    url: `${api}/delete`,
    method: 'delete',
    params: { fileName: data }
  })
}
