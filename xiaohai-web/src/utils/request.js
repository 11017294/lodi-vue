import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import message from 'element-ui/packages/message'
import qs from 'qs'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API, // url = base url
  // withCredentials: true, // 跨域请求时发送 Cookie
  timeout: 15000 // 请求超时时间,
})

// request 请求拦截器
service.interceptors.request.use(config => {
  // 在发送请求之前执行某些操作
  if (store.getters.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    config.headers['authorization'] = getToken()
  }

  if (config.method === 'get') {
    config.paramsSerializer = function(params) {
      Object.keys(params).forEach(key => {
        if (params[key] === null) {
          delete params[key]
        }
      })
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
  return config
},
error => {
  // do something with request error
  console.log(error) // for debug
  return Promise.reject(error)
}
)

// response 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想获取 http 信息，例如标头或状态，请返回响应 =>响应
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // 如果自定义代码不是 200，则将其判断为错误。
    if (res.code !== 200) {
      // 登录异常
      if (res.code === 401) {
        // to re-login
        MessageBox.confirm('您已注销，您可以取消以留在此页面，或重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      message.error(res.msg)
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    if (error.response) {
      console.log(error)
      // 业务异常
      if (error.response.data.code === 400) {
        message.error(error.response.data.msg)
      }
      // 权限异常
      if (error.response.data.code === 403) {
        message.error(error.response.data.msg)
      }
      // 登录异常
      if (error.response.data.code === 401) {
        // to re-login
        MessageBox.confirm('您已注销，您可以取消以留在此页面，或重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      message.error(error)
    } else {
      // 设置触发错误的请求时发生某些情况
      console.log('Error', error)
      message.error('系统异常')
    }
    console.log(error)
    return Promise.reject('系统异常')
  }
)

export default service
