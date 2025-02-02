<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import RightSide from '@/components/layouts/RightSide.vue'
import { getArticleByTagId } from '@/api/show'
import articleList from '@/components/articleList/index.vue'
import useStore from '@/store/index'
import { getQueryVariable } from '@/utils/publicMethods'

const store = useStore()
// 标签名称
const name = ref('标签')
// 展示文章列表
const dataList: any = ref([])
// 总数
const total = ref()
// 是否展示加载更多
const loadMores = ref(true)
const data = reactive({
  queryParams: {
    currentPage: 1,
    pageSize: 10,
    tagId: 0
  }
})

const { queryParams } = toRefs(data)

const router = useRouter()

/** 查询展示文章列表 */
function getList(val: any) {
  queryParams.value.tagId = val
  queryParams.value.currentPage = 1
  queryParams.value.pageSize = 10
  getArticleByTagId(queryParams.value).then((response) => {
    dataList.value = response.data.records
    total.value = response.data.total
    const a = Math.ceil(total.value / queryParams.value.pageSize)
    loadMores.value = queryParams.value.currentPage + 1 <= a
  })
}

// 标签跳转
function cancelClick(tag: any) {
  name.value = tag.name
  getList(tag.id)
}

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
    getArticleByTagId(queryParams.value).then((response) => {
      dataList.value = [...dataList.value, ...response.data.records]
    })
  }
}
if (getQueryVariable('id')) {
  getList(getQueryVariable('id'))
}
</script>

<template>
  <!--左内容区-->
  <el-col :lg="14" :xl="11">
    <h1 class="flex-center">
      <svg-icon class="link" icon-class="tags" @click="queryParams.tagId = 0"></svg-icon>
      {{ name }}
    </h1>
    <el-card v-if="queryParams.tagId == 0" class="box-card" shadow="hover">
      <el-space size="large" wrap>
        <div v-for="tag in store.tags" :key="tag.id">
          <el-button text bg size="large" @click="cancelClick(tag)">
            <svg-icon icon-class="label-sign"></svg-icon> {{ tag.name }}
            <div class="tags">{{ tag.articleCount }}</div>
          </el-button>
        </div>
      </el-space>
    </el-card>
    <el-space v-else direction="vertical" fill size="large" style="display: flex">
      <articleList :dataList="dataList"></articleList>
      <el-button v-if="loadMores" text type="primary" bg @click="loadMore">加载更多</el-button>
      <el-button v-else text disabled>没有更多了</el-button>
    </el-space>
  </el-col>

  <!--右内容区-->
  <el-col class="hidden-md-and-down" :lg="6" :xl="5">
    <RightSide></RightSide>
  </el-col>
</template>

<style scoped>
.box-card {
  padding: 0;
  border-radius: 10px;
  border: 1px solid transparent;
}
.link:hover {
  cursor: pointer;
}
</style>
