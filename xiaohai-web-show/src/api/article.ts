import request from '@/utils/axios'

const api = '/article'

// 新增文章
export const addArticle = (data: any) => {
  return request({
    url: `${api}/add`,
    method: 'post',
    data
  })
}

// 更新文章
export const updateArticle = (data: any) => {
  return request({
    url: `${api}/update`,
    method: 'put',
    data
  })
}

// 根据用户id获取文章
export const getArticleByUserId = (query: any) => {
  return request({
    url: `${api}/getArticleByUserId`,
    method: 'get',
    params: query
  })
}
