import request from '@/utils/axios'

const api = '/index'
const comment = '/note'

// 标签
export const listTag = () => {
  return request({
    url: '/tags/getTagList',
    method: 'get'
  })
}
// 分类
export const listCategory = () => {
  return request({
    url: '/category/getCategoryList',
    method: 'get'
  })
}
// 查询展示文章表列表数据
export const listArticles = (query: any) => {
  return request({
    url: `${api}/getRecommendedArticle`,
    method: 'get',
    params: query
  })
}
// 根据分类获取文章列表
export const getArticleByCategoryId = (query: any) => {
  return request({
    url: '/category/getArticleByCategoryId',
    method: 'get',
    params: query
  })
}
// 根据标签获取文章列表
export const getArticleByTagId = (query: any) => {
  return request({
    url: '/tags/getArticleByTagId',
    method: 'get',
    params: query
  })
}
// 查询热榜文章列表数据
export const hotArticles = () => {
  return request({
    url: `${api}/getHotArticle`,
    method: 'get',
    params: {
      currentPage: 1
    }
  })
}
// 文章详情
export const article = (id: any) => {
  return request({
    url: `${api}/get`,
    method: 'get',
    params: { id }
  })
}
// 归档列表
export const listBack = (query: any) => {
  return request({
    url: `${api}/back`,
    method: 'get',
    params: query
  })
}
// 查询文章
export const getSearch = (query: any) => {
  return request({
    url: `${api}/getArticleBySearch`,
    method: 'get',
    params: query
  })
}

// 文章id查询评论
export const getComment = (id: any) => {
  return request({
    url: `${api}/article/comment/${id}`,
    method: 'get'
  })
}
// 新增评论
export const addComment = (data: any) => {
  return request({
    url: `${comment}/comment`,
    method: 'post',
    data
  })
}
// 站点信息展示
export const findShowBasic = () => {
  return request({
    url: `${api}/findShowBasic`,
    method: 'get'
  })
}
export const articleLike = (data: any) => {
  return request({
    url: `${comment}/article-like`,
    method: 'post',
    data
  })
}
// 友情链接
export const friendLink = () => {
  return request({
    url: `${api}/friendLink`,
    method: 'get'
  })
}
// 删除评论
export const deleteComment = (ids: any) => {
  return request({
    url: `${comment}/comment/${ids}`,
    method: 'delete'
  })
}
