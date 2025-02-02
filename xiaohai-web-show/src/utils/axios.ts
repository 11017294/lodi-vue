import Axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { useStore } from 'vuex'
import useStore from '@/store/index'
import { getToken, getTokenName } from '@/utils/auth'
import router from '@/router'

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000 // 请求超时 20s
})
// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
  (response) => {
    const newResponse = { ...response }
    // 在发送请求之前执行某些操作
    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      newResponse.headers[getTokenName()] = getToken()
    }
    /**
     * 根据你的项目实际情况来对 config 做处理
     * 这里对 config 不做任何处理，直接返回
     */
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)
let messageBoxFlag = 0 // 默认 MessageBox 未打开
// 后置拦截器（获取到响应时的拦截）
axios.interceptors.response.use(
  (response) => {
    /**
     * 根据你的项目实际情况来对 response 和 error 做处理
     * 这里对 response 和 error 不做任何处理，直接返回
     */
    const res = response.data

    // 登录异常
    if (res.code === 401) {
      // 防止弹出多次
      if (messageBoxFlag === 0) {
        messageBoxFlag = 1 // 修改标记，打开 MessageBox
        ElMessageBox.confirm('继续使用，请重新登录', '提示', {
          confirmButtonText: '去登陆',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            messageBoxFlag = 0
            window.open(`/login?show=${router.currentRoute.value.fullPath}`, '_self')
          })
          .catch(() => {
            messageBoxFlag = 0
          })
        const store = useStore()
        store.resetToken().then(() => {
          // window.location.reload()
        })
      }
    }
    if (res.code !== 0) {
      ElMessage.error(res.message || 'Error')
      return Promise.reject(res.message || 'Error')
    }
    return res
  },
  (error) => {
    if (error.response && error.response.data) {
      const code = error.response.status
      const msg = error.response.data.message
      ElMessage.error(`Code: ${code}, Message: ${msg}`)
    } else {
      ElMessage.error(`${error}`)
    }
    return Promise.reject(error)
  }
)

export default axios
