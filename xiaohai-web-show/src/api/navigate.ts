import request from '@/utils/axios'

const api = '/navigate'

// 获取导航
export const getNavList = (data: any) => {
  return request({
    url: `${api}/list`,
    method: 'get',
    params: data
  })
}

// 获取导航分类
export const getNavCategoryList = () => {
  return request({
    url: `${api}/getCategoryList`,
    method: 'get'
  })
}
