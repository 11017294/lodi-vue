import request from '@/utils/axios'

const api = '/user'

// 修改用户个人信息
export const updateUserInfo = (data: any) => {
  return request({
    url: `${api}/updateUserInfo`,
    method: 'put',
    data
  })
}

// 上传头像
export const uploadAvatar = (data: any) => {
  return request({
    url: `${api}/uploadAvatar`,
    method: 'post',
    data
  })
}
