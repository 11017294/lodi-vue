import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { findShowBasic, friendLink, hotArticles, listCategory, listTag } from '@/api/show'
import { image } from '@/utils/publicMethods'
import { getInfo, login, logout } from '@/api/auth'
import {ElMessage} from "element-plus";

const useStore = defineStore('user', {
  state: () => {
    return {
      token: getToken(),
      name: '',
      summary: '',
      gitee: '',
      github: '',
      qqNumber: '',
      weChat: '',
      avatar: '',
      userId: '',
      showBasic: '',
      website: {} as any,
      tags: [],
      categories: [],
      friendLinkList: [],
      hotArticles: [],
      count: 0,
      app: 0
    }
  },
  actions: {
    // 登录
    login(userInfo: any) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((respons) => {
            const { data, message } = respons
            if (data == null) {
              ElMessage.error(message)
              return
            }
            this.token = data
            setToken(data)
            resolve('')
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取用户登录信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((response) => {
            const { data } = response
            if (data == null) {
              ElMessage.error('验证失败，请重新登录。')
              return
            }
            const { username, nickname, userAvatar, id, summary, gitee, github, qqNumber, weChat } =
              data
            this.name = nickname || username
            this.avatar = userAvatar
            this.userId = id
            this.summary = summary
            this.gitee = gitee
            this.github = github
            this.qqNumber = qqNumber
            this.weChat = weChat
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 退出系统
    logOut() {
      return new Promise<void>((resolve, reject) => {
        logout()
          .then(() => {
            removeToken()
            window.location.reload()
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取系统信息
    getSystem() {
      return new Promise<void>((resolve, reject) => {
        findShowBasic()
          .then((response) => {
            this.showBasic = response.data
            // this.website = response.data.website
            document.title = this.website.title
            // 获取指定 meta 标签
            const descriptionMeta = document.querySelector('meta[name="description"]')
            if (descriptionMeta) {
              // 修改 meta 标签的 content 属性
              descriptionMeta.setAttribute('content', this.website.description)
            }
            // 获取其他 meta 标签
            const keywordsMeta = document.querySelector('meta[name="keywords"]')
            if (keywordsMeta) {
              // 修改 meta 标签的 content 属性
              keywordsMeta.setAttribute('content', this.website.keywords)
            }
            // 获取现有的或新建一个 favicon 链接元素
            const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement
            if (faviconLink) {
              faviconLink.href = image(`${this.website.logo}?random=${new Date().getTime()}`)
            }
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取标签信息
    getTags() {
      return new Promise<void>((resolve, reject) => {
        listTag()
          .then((response) => {
            this.tags = response.data
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取分类信息
    getCategories() {
      return new Promise<void>((resolve, reject) => {
        listCategory()
          .then((response) => {
            this.categories = response.data
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取友情链接
    getFriendLink() {
      return new Promise<void>((resolve, reject) => {
        friendLink()
          .then((response) => {
            this.friendLinkList = response.data
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取热门文章
    getHot() {
      return new Promise<void>((resolve, reject) => {
        hotArticles()
          .then((response) => {
            this.hotArticles = response.data.records
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // remove token
    resetToken() {
      return new Promise<void>((resolve) => {
        removeToken()
        resolve()
      })
    }
  }
})
export default useStore
