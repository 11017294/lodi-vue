import request from '@/utils/axios'

const api = '/comment'

// 获取登录用户评论
export const getCommentByCurrentUser = (data: any) => {
  return request({
    url: `${api}/getCommentByCurrentUser`,
    method: 'get',
    params: data
  })
}

// 获取评论
export const getCommentTree = (data: any) => {
  return request({
    url: `${api}/getCommentTree`,
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
