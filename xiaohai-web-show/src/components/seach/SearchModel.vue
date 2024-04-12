<template>
  <svg-icon
    icon-class="search"
    class="search-icon"
    style="font-size: 20px"
    @click="dialogVisible = true"
  ></svg-icon>
  <el-dialog v-model="dialogVisible" :append-to-body="true" :fullscreen="isMobile()">
    <template #header>
      <span class="search-title">搜索</span>
    </template>
    <!-- 输入框 -->

    <div class="search-input-wrapper">
      <input v-model="data.keyword" placeholder="输入文章标题或内容..." />
      <svg-icon
        icon-class="search"
        class="search-icon"
        style="font-size: 25px; margin-right: 10px"
      ></svg-icon>
    </div>

    <!-- 搜索结果 -->
    <div class="search-result-wrapper">
      <hr class="divider" />
      <ul style="list-style: none; padding: 0">
        <li class="search-reslut" v-for="item of data.articleList" :key="item.id">
          <!-- 文章标题 -->
          <el-link @click="goTo(item.id)" style="font-size: larger" v-html="item.title"></el-link>
          <!-- 文章内容 -->
          <p class="search-reslut-content" v-html="item.summary" />
        </li>
      </ul>
      <el-space v-if="data.keyword" direction="vertical" fill size="large" style="display: flex">
        <el-button v-if="loadMores" text type="primary" bg @click="loadMore">加载更多</el-button>
      </el-space>
      <!-- 搜索结果不存在提示 -->
      <div v-show="data.flag && data.articleList.length === 0" style="font-size: 0.875rem">
        找不到您查询的内容：{{ data.keyword }}
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getSearch } from '@/api/show'

const dialogVisible = ref(false)
// 是否展示加载更多
const loadMores = ref(true)
// 总数
const total = ref()

const data = reactive({
  keyword: '',
  articleList: [],
  flag: false
})
function reset() {
  data.keyword = ''
  data.articleList = []
  data.flag = false
}
// 请求参数
const queryData = reactive({
  queryParams: {
    keyword: '',
    pageSize: 10,
    currentPage: 1
  }
})
const { queryParams } = toRefs(queryData)

const router = useRouter()
// 页面跳转
function goTo(id: any) {
  dialogVisible.value = false
  router.push({ path: `/article/${id}` })
}

// 判断屏幕大小
function isMobile() {
  reset()
  const { clientWidth } = document.documentElement
  console.log(clientWidth)
  return clientWidth <= 960
}
watch(
  () => data.keyword,
  () => {
    data.flag = data.keyword.trim() !== ''
    if (data.flag) {
      queryParams.value.keyword = data.keyword
      queryParams.value.currentPage = 1
      getSearch(queryParams.value).then((res) => {
        data.articleList = res.data.records
        total.value = res.data.total
        const a = Math.ceil(total.value / queryParams.value.pageSize)
        loadMores.value = queryParams.value.currentPage + 1 <= a
      })
    }
  }
)

/**
 * 加载更多
 */
function loadMore() {
  const a = Math.ceil(total.value / queryParams.value.pageSize)
  if (queryParams.value.currentPage + 1 >= a) {
    loadMores.value = false
  }
  if (queryParams.value.currentPage + 1 <= a) {
    queryParams.value.currentPage = 1 + queryParams.value.currentPage
    getSearch(queryParams.value).then((response) => {
      data.articleList = [...data.articleList, ...(response.data.records as [])]
    })
  }
}
</script>

<style scoped>
.search-title {
  color: #fd5a5a;
  font-size: 1.25rem;
  line-height: 1;
}
.search-input-wrapper {
  display: flex;
  padding: 5px;
  border: 2px solid #fcbfbf;
  border-radius: 2rem;
  align-items: center;
}
.search-input-wrapper input {
  width: 99%;
  margin-left: 5px;
  outline: none;
  border: 0;
  background-color: transparent;
}
@media (min-width: 960px) {
  .search-result-wrapper {
    padding-right: 5px;
    height: 450px;
    overflow: auto;
  }
}
@media (max-width: 959px) {
  .search-result-wrapper {
    overflow: auto;
  }
}
.search-reslut a {
  color: #555;
  font-weight: bold;
  /*border-bottom: 1px solid #999;*/
  text-decoration: none;
}
.search-reslut-content {
  color: #555;
  cursor: pointer;
  border-bottom: 1px dashed #ccc;
  padding: 5px 0;
  line-height: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
