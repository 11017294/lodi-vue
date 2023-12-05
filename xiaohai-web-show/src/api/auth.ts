import request from '@/utils/axios'

const api = '/auth'

// 登录
export const login = (data: any) => {
  return request({
    url: `${api}/login`,
    method: 'post',
    data
  })
}

// 注册
export const register = (data: any) => {
  return request({
    url: `${api}/register`,
    method: 'post',
    data
  })
}

// 注销
export const logout = () => {
  return request({
    url: `${api}/logout`,
    method: 'post'
  })
}

// 发送邮箱验证码
export const sendEmailCode = (data: any) => {
  return request({
    url: `${api}/sendEmailCode`,
    method: 'post',
    data
  })
}

// 获取用户信息
export const getInfo = () => {
  return request({
    url: `${api}/get`,
    method: 'get'
  })
}
