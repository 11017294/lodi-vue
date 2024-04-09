import request from '@/utils/axios'

const api = '/comment'

// 按文章id获取评论
export const getByArticleId = (data: any) => {
  return request({
    url: `${api}/getByArticleId`,
    method: 'get',
    params: data
  })
}

// 发布评论
export const addComment = (data: any) => {
  return request({
    url: `${api}/add`,
    method: 'post',
    data
  })
}

// 删除评论
export const deleteComment = (data: any) => {
  return request({
    url: `${api}/delete`,
    method: 'delete',
    data
  })
}
