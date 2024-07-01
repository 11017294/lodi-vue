<template>
  <el-space class="hidden-sm-and-down" direction="vertical" fill size="large" style="display: flex">
    <el-card
      :body-style="{ padding: '0px' }"
      v-for="article in dataList"
      :key="article"
      class="box-card box-card-hover"
      shadow="hover"
    >
      <div style="display: flex; flex-direction: row">
        <el-image
          fit="cover"
          :src="image(article.cover)"
          class="image"
          @click="getArticle(article.id)"
        />
        <div style="margin-left: 18px; display: flex; justify-content: space-between; width: 100%">
          <h3
            style="
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
              white-space: normal;
              word-wrap: break-word;
              word-break: break-all;
            "
            @click="getArticle(article.id)"
          >
            <svg-icon v-if="article.isTop == 1" icon-class="top" />
            {{ article.title }}
          </h3>
          <span class="text-xs font-number text-color" style="margin-right: 32px">
            {{ article.createTime }}
          </span>
        </div>
      </div>
      <div
        style="display: flex; flex-direction: row; margin-top: 10px; justify-content: space-between"
      >
        <el-space alignment="center" size="large">
          <span class="text-xs font-text text-color"
            ><el-icon><Avatar /></el-icon>
            <a @click="lookSpace(article.userId)" v-if="article.nickname" style="cursor: pointer">
              {{ article.nickname }}
            </a>
            <a @click="lookSpace(article.userId)" v-else style="cursor: pointer">
              {{ article.username }}
            </a>
          </span>
          <el-icon><Grid /></el-icon>
          <el-tag size="small">{{ article.categoryName }}</el-tag>
          <span class="text-xs font-text text-color">
            <el-tag size="small" type="info" v-if="article.isPublish === 0">保密</el-tag>
            <el-tag size="small" type="success" v-else-if="article.isPublish === 1">公开</el-tag>
          </span>
          <span class="text-xs font-text text-color" v-if="article.isPublish === 1">
            <el-tag size="small" type="warning" v-if="article.auditStatus === 0">待审核</el-tag>
            <el-tag size="small" type="success" v-else-if="article.auditStatus === 1"
              >审核通过</el-tag
            >
            <el-tag size="small" type="danger" v-else-if="article.auditStatus === 2"
              >审核不通过</el-tag
            >
          </span>
          <span class="text-xs font-number text-color">
            <svg-icon icon-class="eye-light" style="font-size: 15px" />
            {{ article.clickCount }}
          </span>
          <span class="text-xs font-number text-color">
            <svg-icon icon-class="收藏" /> {{ article.collectCount }}</span
          >
          <span class="text-xs font-number text-color"
            ><svg-icon icon-class="message" style="font-size: 15px" />
            {{ article.commentCount }}</span
          >
        </el-space>
        <el-space alignment="center" size="large" v-if="store.userId === queryParams.id">
          <div class="operate" style="margin-right: 18px">
            <el-tooltip content="浏览" placement="left">
              <el-button :icon="Search" @click="getArticle(article.id)" circle />
            </el-tooltip>
            <el-tooltip content="编辑" placement="bottom">
              <el-button type="primary" :icon="Edit" @click="editArticle(article.id)" circle />
            </el-tooltip>
            <el-tooltip v-if="article.isPublish === 0" content="公布" placement="top">
              <el-button type="success" :icon="Open" @click="publishHandle(article.id)" circle />
            </el-tooltip>
            <el-tooltip v-else content="下架" placement="top">
              <el-button type="warning" :icon="TurnOff" @click="privateHandle(article.id)" circle />
            </el-tooltip>
            <el-tooltip content="删除" placement="right">
              <el-button type="danger" :icon="Delete" @click="deleteHandle(article.id)" circle />
            </el-tooltip>
          </div>
        </el-space>
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
import { Avatar, Delete, Edit, Grid, Open, Search, TurnOff } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import {
  cancelPublishArticle,
  deleteArticle,
  getArticleByUserId,
  publishArticle
} from '@/api/article'
import { editArticle, getArticle, image, lookSpace } from '@/utils/publicMethods'
import useStore from '@/store'
import { getUserInfo } from '@/api/user'

const store = useStore()
const route = useRoute()
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
function getArticleList() {
  queryParams.value.currentPage = 1
  getArticleByUserId(queryParams.value)
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
    getArticleByUserId(queryParams.value)
      .then((response) => {
        dataList.value = [...dataList.value, ...response.data.records]
      })
      .finally(() => {
        loading.value = false // 加载完成
      })
  }
}

// 获取用户信息
function getUser() {
  if (route.params.id === store.userId) {
    getArticleList()
    return
  }
  const userId = route.params.id || store.userId
  getUserInfo(userId).then((res) => {
    queryParams.value.id = res.data.id
    getArticleList()
  })
}

// 删除文章
function deleteHandle(id: any) {
  ElMessageBox.confirm('确定删除文章嘛？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteArticle({ id }).then((res: any) => {
        ElMessage.success(res.message)
        getArticleList()
      })
    })
    .catch(() => {})
}

// 公布文章
function publishHandle(id: any) {
  publishArticle({ id }).then((res: any) => {
    ElMessage.success(res.message)
    getArticleList()
  })
}

// 下架文章
function privateHandle(id: any) {
  cancelPublishArticle({ id }).then((res: any) => {
    ElMessage.success(res.message)
    getArticleList()
  })
}
getUser()
</script>

<style scoped>
.box-card {
  max-height: 180px;
  padding: 20px 0 20px 20px;
  border-radius: 10px;
}

.image {
  border-radius: 3px;
  min-width: 102px;
  height: 60px;
}

.box-card-hover:hover {
  filter: drop-shadow(0 0 0.5em rgb(252, 191, 191));
  transform: scale(1.01);
}

.pagination-wrapper {
  display: flex;
  justify-content: center; /* 水平居中 */
  margin-top: 20px; /* 根据需要调整间距 */
}
</style>
