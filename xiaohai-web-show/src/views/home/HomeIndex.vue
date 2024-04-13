<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import RightSide from '@/components/layouts/RightSide.vue'
import { listArticles, getArticleByCategoryId } from '@/api/show'

import articleList from '@/components/articleList/index.vue'
import { getArticle, image } from '@/utils/publicMethods'
import useStore from '@/store'

const store = useStore()
// 轮播列表
const carouselList: any = ref([])

// 展示文章列表
const dataList: any = ref([])
// 总数
const total = ref()
// 是否展示加载更多
const loadMores = ref(true)
// 是否展开分类
const classify = ref(false)
// 分类列表
const { categories } = store

// 表示选中的全部按钮
const selectedButton = ref(null)

const data = reactive({
  queryParams: {
    currentPage: 1,
    pageSize: 10,
    categoryId: null
  }
})

const { queryParams } = toRefs(data)

/**
 * 轮播
 */
function getCarouselList() {
  queryParams.value.currentPage = 1
  queryParams.value.pageSize = 5
  listArticles(queryParams.value).then((response) => {
    carouselList.value = response.data.records
  })
}

/** 查询展示文章列表 */
function getList() {
  queryParams.value.currentPage = 1
  queryParams.value.pageSize = 10
  listArticles(queryParams.value).then((response) => {
    dataList.value = response.data.records
    total.value = response.data.total
    const a = Math.ceil(total.value / queryParams.value.pageSize)
    loadMores.value = queryParams.value.currentPage + 1 <= a
  })
}

function getListByCategoryId(id: any) {
  queryParams.value.categoryId = id
  queryParams.value.currentPage = 1
  queryParams.value.pageSize = 10
  getArticleByCategoryId(queryParams.value).then((response) => {
    dataList.value = response.data.records
    total.value = response.data.total
    const a = Math.ceil(total.value / queryParams.value.pageSize)
    loadMores.value = queryParams.value.currentPage + 1 <= a
  })
  selectedButton.value = id
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
    listArticles(queryParams.value).then((response) => {
      dataList.value = [...dataList.value, ...response.data.records]
    })
  }
}
function classification() {
  classify.value = !classify.value
}

getList()
getCarouselList()
</script>

<template>
  <!--左内容区-->
  <el-col :lg="14" :xl="11">
    <!--电脑端-->
    <el-space
      class="hidden-sm-and-down"
      direction="vertical"
      fill
      size="large"
      style="display: flex"
    >
      <el-carousel :interval="4000" height="370px" style="border-radius: 10px">
        <el-carousel-item v-for="article in carouselList" :key="article">
          <el-image fit="cover" :src="image(article.cover)" @click="getArticle(article.id)" />
          <div class="carousel-title" @click="getArticle(article.id)">
            <span>{{ article.title }}</span>
          </div>
        </el-carousel-item>
      </el-carousel>

      <el-card class="box-card" shadow="hover" :body-style="{ padding: '10px' }">
        <div class="card-header category" v-if="!classify">
          <el-space wrap size="default">
            <el-button
              style="border-radius: 10px"
              :class="{ selected: null === selectedButton }"
              @click="getList"
              >推荐</el-button
            >
            <el-button
              style="border-radius: 10px"
              v-for="category in categories"
              :class="{ selected: category.id === selectedButton }"
              @click="getListByCategoryId(category.id)"
            >
              {{ category.name }}
              <div class="tags">{{ category.articleCount }}</div>
            </el-button>
          </el-space>
          <svg-icon icon-class="spread" class="iconUnfold" @click="classification"></svg-icon>
        </div>
        <div class="card-header" v-else>
          <el-space wrap size="default">
            <el-button
              style="border-radius: 10px"
              :class="{ selected: null === selectedButton }"
              @click="getList"
              >推荐</el-button
            >
            <el-button
              style="border-radius: 10px"
              v-for="category in categories"
              @click="getListByCategoryId(category.id)"
            >
              {{ category.name }}
              <div class="tags">{{ category.articleCount }}</div>
            </el-button>
          </el-space>
          <svg-icon icon-class="pack-up" class="iconUnfold" @click="classification"></svg-icon>
        </div>
      </el-card>
      <articleList :dataList="dataList"></articleList>
      <el-button v-if="loadMores" text type="primary" bg @click="loadMore">加载更多</el-button>
      <el-button v-else text disabled>没有更多了</el-button>
    </el-space>
  </el-col>
  <!--  手机端-->
  <el-space class="hidden-md-and-up" direction="vertical" fill size="large">
    <el-carousel :interval="4000" height="210px" style="border-radius: 10px">
      <el-carousel-item v-for="article in carouselList" :key="article">
        <el-image fit="cover" :src="image(article.cover)" @click="getArticle(article.id)" />
        <div class="carousel-title" @click="getArticle(article.id)">
          <span>{{ article.title }}</span>
        </div>
      </el-carousel-item>
    </el-carousel>

    <el-card class="box-card" shadow="hover" :body-style="{ padding: '10px' }">
      <div class="card-header category" v-if="!classify">
        <el-space wrap size="default">
          <el-button
            style="border-radius: 10px"
            :class="{ selected: null === selectedButton }"
            @click="getList"
            >推荐</el-button
          >
          <el-button
            style="border-radius: 10px"
            v-for="category in categories"
            :class="{ selected: category.id === selectedButton }"
            @click="getListByCategoryId(category.id)"
          >
            {{ category.name }}
            <div class="tags">{{ category.articleCount }}</div>
          </el-button>
        </el-space>
        <svg-icon icon-class="spread" class="iconUnfold" @click="classification"></svg-icon>
      </div>
      <div class="card-header" v-else>
        <el-space wrap size="default">
          <el-button
            style="border-radius: 10px"
            :class="{ selected: null === selectedButton }"
            @click="getList"
            >全部</el-button
          >
          <el-button
            style="border-radius: 10px"
            v-for="category in categories"
            @click="getListByCategoryId(category.id)"
          >
            {{ category.name }}
            <div class="tags">{{ category.articleCount }}</div>
          </el-button>
        </el-space>
        <svg-icon icon-class="pack-up" class="iconUnfold" @click="classification"></svg-icon>
      </div>
    </el-card>
    <articleList :dataList="dataList"></articleList>
    <el-button v-if="loadMores" text type="primary" bg @click="loadMore">加载更多</el-button>
    <el-button v-else text disabled>没有更多了</el-button>
  </el-space>
  <!--右内容区-->
  <el-col class="hidden-md-and-down" :lg="6" :xl="5">
    <RightSide></RightSide>
  </el-col>
</template>

<style scoped>
.box-card {
  max-height: 180px;
  padding: 0;
  border-radius: 10px;
  border: 1px solid transparent;
}

.category {
  height: 32px;
}

.carousel-title {
  cursor: pointer;
  position: absolute;
  z-index: 10;
  bottom: 40px;
  height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  font-size: 22px;
  color: #ecf8ff;
  font-weight: bold;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.selected {
  color: var(--el-button-hover-text-color);
  border-color: var(--el-button-hover-border-color);
  background-color: var(--el-button-hover-bg-color);
  outline: none;
}
.iconUnfold {
  padding-top: 10px;
}
.iconUnfold:hover {
  cursor: pointer;
  display: block;
  transition: all 0.2s;
  color: #409eff;
  text-shadow: 2px 2px 5px #409eff;
}
</style>
