<template>
  <el-space class="hidden-sm-and-down" direction="vertical" fill size="large" style="display: flex">
    <el-card
      :body-style="{ padding: '0px' }"
      v-for="comment in dataList"
      :key="comment"
      class="box-card box-card-hover"
      shadow="hover"
    >
      <div style="display: flex; flex-wrap: wrap; align-items: flex-start">
        <!-- 头像独占一列 -->
        <div style="flex: none; margin-right: 20px">
          <el-avatar v-if="comment.userAvatar" :src="image(comment.userAvatar)" />
        </div>
        <!-- 名字和标签在同一行 -->
        <div style="flex: auto; display: flex; flex-direction: column; align-items: flex-start">
          <div style="display: flex; align-items: center" class="text-sm">
            <span>{{ comment.username }}</span>
            <el-space style="margin-left: 12px">
              <el-tag
                v-if="comment.source === 'ARTICLE'"
                style="cursor: pointer"
                border
                @click="getArticle(comment.articleId)"
                >文章</el-tag
              >
              <el-tag
                v-else-if="comment.source === 'MESSAGE_BOARD'"
                style="cursor: pointer"
                type="success"
                border
                @click="lookMessage"
                >留言板</el-tag
              >
              <el-tag v-else style="cursor: pointer" type="success" border>
                {{ comment.source }}
              </el-tag>
            </el-space>
          </div>
          <!-- 评论内容在第二行 -->
          <div style="margin-top: 5px">
            <p class="comment-content" v-html="parseEmojis(comment.content)"></p>
          </div>
        </div>
      </div>
    </el-card>
    <div class="pagination-wrapper">
      <el-button v-if="loading" text type="primary" bg disabled>正在加载...</el-button>
      <el-button v-else-if="loadMores" text type="primary" bg @click="loadMore">加载更多</el-button>
      <el-button v-else text disabled>没有更多了</el-button>
    </div>
  </el-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useStore from '@/store'
import { getCommentByCurrentUser } from '@/api/comment'
import { allEmoji } from '@/components/emoji/emoji'
import { getArticle, image, lookMessage } from '@/utils/publicMethods'

const store = useStore()
// 展示文章列表
const dataList: any = ref([])
// 正在加载
const loading = ref(true)
// 是否展示加载更多
const loadMores = ref(true)
// 总数
const total = ref()

const queryParams = ref({
  currentPage: 1,
  pageSize: 10,
  id: store.userId
})

// 获取文章列表
function getCommentList() {
  queryParams.value.currentPage = 1
  getCommentByCurrentUser(queryParams.value)
    .then((res: any) => {
      dataList.value = res.data.records
      total.value = res.data.total
      const a = Math.ceil(total.value / queryParams.value.pageSize)
      loadMores.value = queryParams.value.currentPage + 1 <= a
    })
    .finally(() => {
      loading.value = false
    })
}

// 加载更多
function loadMore() {
  const a = Math.ceil(total.value / queryParams.value.pageSize)
  if (queryParams.value.currentPage + 1 >= a) {
    loadMores.value = false // 没有更多了
  }
  loading.value = true // 加载中
  if (queryParams.value.currentPage + 1 <= a) {
    queryParams.value.currentPage = 1 + queryParams.value.currentPage
    getCommentByCurrentUser(queryParams.value)
      .then((response) => {
        dataList.value = [...dataList.value, ...response.data.records]
      })
      .finally(() => {
        loading.value = false // 加载完成
      })
  }
}

function parseEmojis(text: any) {
  const emojiMap: any = allEmoji()
  // 使用正则表达式匹配表情符号，并替换为对应的图片标签
  return text.replace(/\[[^\[\]]+\]/g, (match: any) => {
    const emojiImg = emojiMap[match]
    if (emojiImg) {
      return `<img src="${emojiImg}" alt="${match}" style="width: 20px;"/>`
    }
    return match // 如果未找到对应的表情图片，则保留原始文本
  })
}

getCommentList()
</script>

<style scoped>
.box-card {
  max-height: 180px;
  padding: 20px 0 20px 20px;
  border-radius: 10px;
  overflow: hidden; /* 确保内容不会溢出卡片 */
}

.pagination-wrapper {
  display: flex;
  justify-content: center; /* 水平居中 */
  margin-top: 20px; /* 根据需要调整间距 */
}

.comment-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
