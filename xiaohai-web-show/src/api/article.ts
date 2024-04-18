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

// 删除文章
export const deleteArticle = (data: any) => {
  return request({
    url: `${api}/delete`,
    method: 'delete',
    data
  })
}

// 发布文章
export const publishArticle = (data: any) => {
  return request({
    url: `${api}/publish`,
    method: 'post',
    data
  })
}

// 取消文章发布
export const cancelPublishArticle = (data: any) => {
  return request({
    url: `${api}/cancelPublish`,
    method: 'post',
    data
  })
}
