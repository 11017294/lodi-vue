<template>
  <!--左内容区-->
  <el-col :lg="14" :xl="11">
    <!--电脑端-->
    <el-card class="box-card hidden-sm-and-down" shadow="hover">
      <h1 class="flex-center">{{ articleOne.title }}</h1>
      <span style="display: flex; align-items: center; justify-content: space-between">
        <span style="display: flex; align-items: center">
          <el-space size="default">
            <el-avatar
              v-if="articleOne.userAvatar"
              size="default"
              :src="image(articleOne.userAvatar)"
            />
            <span class="text-sm">{{ articleOne.username }}</span>
            <el-tag size="default">{{ articleOne.categoryName }}</el-tag>
            <template v-for="(item, index) in tags">
              <el-tag
                v-if="articleOne.tagsId && articleOne.tagsId.includes(item.id)"
                :key="index"
                style="margin-right: 4px"
                type="success"
                size="default"
                :label="index"
                border
                >{{ item.name }}
              </el-tag>
            </template>
          </el-space>
        </span>
        <el-space alignment="center" size="large">
          <span class="text-sm font-number text-color">
            <svg-icon icon-class="time-light" />{{ articleOne.createTime }}</span
          >
          <span class="text-sm font-number text-color">
            <svg-icon icon-class="eye-light" style="font-size: 15px" /> {{ articleOne.clickCount }}
          </span>
          <span class="text-sm font-number text-color">
            <svg-icon icon-class="收藏" style="font-size: 15px" />
            {{ articleOne.collectCount }}</span
          >
          <span class="text-sm font-number text-color">
            <svg-icon icon-class="message" style="font-size: 15px" /> {{ commentCount }}
          </span>
          <span class="text-sm font-number" @click="clickLike(articleOne)">
            <svg-icon
              :icon-class="articleOne.clickLike == 1 ? 'give-dark' : 'give-light'"
              style="font-size: 15px; cursor: pointer"
              :style="{ color: articleOne.clickLike == 1 ? '#fd5a5a' : '' }"
            />
            {{ articleOne.upvoteCount }}
          </span>
        </el-space>
      </span>
      <hr class="divider" />
      <div v-if="articleOne.isOriginal == 0" class="tip">
        原创 本文DotCode原创文章，转载无需和我联系，但请注明来自本站<br />
      </div>
      <div v-else class="tip">转载 本文转载自{{ articleOne.originalUrl }}<br /></div>
      <v-md-preview :text="articleOne.content" ref="preview"></v-md-preview>
      <hr class="divider" />
      <h3 class="flex-center">推荐</h3>
      <el-row style="justify-content: center">
        <el-col v-for="(o, index) in dataList" :key="o" :span="7" :offset="index > 0 ? 1 : 0">
          <el-card :body-style="{ padding: '0px' }">
            <el-image fit="cover" :src="image(o.cover)" class="image" @click="getArticleId(o.id)" />
            <div style="padding: 14px; text-align: center">
              <el-link :underline="false" @click="getArticleId(o.id)">
                <span>{{ o.title }} </span>
              </el-link>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <hr class="divider" />
      <comments
        v-if="config.disabled"
        :config="config"
        @getListComment="getListComment"
        @submitComments="submitComments"
        @vanishDelete="vanishDelete"
      ></comments>
      <el-space
        class="hidden-sm-and-down"
        direction="vertical"
        fill
        size="large"
        style="display: flex"
      >
        <el-button v-if="loadMores" text type="primary" bg @click="loadMore">加载更多</el-button>
        <el-button v-else text disabled>没有更多了</el-button>
      </el-space>
    </el-card>
  </el-col>
  <!--手机端-->
  <el-card class="box-card hidden-md-and-up" shadow="hover" style="width: 100%">
    <el-space alignment="center" wrap size="small">
      <el-tag size="small">{{ articleOne.categoryName }}</el-tag>
      <template v-for="(item, index) in tags">
        <el-tag
          v-if="articleOne.tagsId && articleOne.tagsId.includes(item.id)"
          :key="index"
          style="margin-right: 4px"
          type="success"
          size="small"
          :label="index"
          border
          >{{ item.name }}
        </el-tag>
      </template>
    </el-space>
    <h1 class="flex-center">{{ articleOne.title }}</h1>
    <span
      style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap"
    >
      <span style="display: flex; align-items: center">
        <el-space size="default">
          <el-avatar
            v-if="articleOne.userAvatar"
            size="small"
            :src="image(articleOne.userAvatar)"
          />
          <span class="text-sm">{{ articleOne.username }}</span>
        </el-space>
      </span>
      <el-space alignment="center" size="small">
        <span class="text-xs font-number text-color" v-if="articleOne.createTime">
          <svg-icon icon-class="time-light" /> {{ articleOne.createTime.split(' ')[0] }}</span
        >
        <span class="text-xs font-number text-color">
          <svg-icon icon-class="eye-light" /> {{ articleOne.clickCount }}
        </span>
        <span class="text-xs font-number text-color">
          <svg-icon icon-class="收藏" /> {{ articleOne.collectCount }}</span
        >
        <span class="text-xs font-number text-color"
          ><svg-icon icon-class="message" /> {{ commentCount }}</span
        >
        <span class="text-xs font-number" @click="clickLike(articleOne)">
          <svg-icon
            :icon-class="articleOne.clickLike == 1 ? 'give-dark' : 'give-light'"
            style="font-size: 15px; cursor: pointer"
            :style="{ color: articleOne.clickLike == 1 ? '#fd5a5a' : '' }"
          />
          {{ articleOne.upvoteCount }}</span
        >
      </el-space>
    </span>
    <hr class="divider" />

    <div v-if="articleOne.isOriginal == 0" class="tip">
      原创 本文DotCode原创文章，转载无需和我联系，但请注明来自本站<br />
    </div>
    <div v-else class="tip">转载 本文转载自{{ articleOne.originalUrl }}<br /></div>
    <v-md-preview :text="articleOne.content"></v-md-preview>

    <hr class="divider" />
    <h3 class="flex-center">推荐</h3>
    <el-card
      :body-style="{ padding: '0px' }"
      v-for="o in dataList"
      :key="o"
      style="margin-bottom: 8px; position: relative"
    >
      <el-image fit="cover" :src="image(o.cover)" class="image" @click="getArticleId(o.id)" />
      <div style="padding: 14px; text-align: center">
        <el-link :underline="false" @click="getArticleId(o.id)">
          <span>{{ o.title }} </span>
        </el-link>
      </div>
    </el-card>
    <hr class="divider" />
    <comments
      v-if="config.disabled"
      :config="config"
      @getListComment="getListComment"
      @submitComments="submitComments"
      @vanishDelete="vanishDelete"
    ></comments>
    <el-space
      class="hidden-sm-and-down"
      direction="vertical"
      fill
      size="large"
      style="display: flex"
    >
      <el-button v-if="loadMores" text type="primary" bg @click="loadMore">加载更多</el-button>
      <el-button v-else text disabled>没有更多了</el-button>
    </el-space>
  </el-card>
  <!--右内容区-->
  <el-col class="hidden-md-and-down" :lg="6" :xl="5">
    <el-space direction="vertical" fill size="large" style="position: fixed; top: 90px">
      <el-card
        class="box-card"
        shadow="hover"
        :body-style="{ padding: '0px', height: '140px' }"
        style="position: relative"
      >
        <img src="../../assets/image/1.jpg" class="image" />

        <!--        <div style="display: flex; padding: 10px; justify-content: center; text-align: center">
          <el-avatar v-if="userBasic.avatar" :src="image(userBasic.avatar)" class="panThumb" />

          <el-space direction="vertical" :size="'large'" fill style="margin-top: 20px; width: 80%">
            <h2 style="margin-bottom: 0px">{{ userBasic.username }}</h2>
            <div>{{ userBasic.summary }}</div>
            <div style="padding-top: 20px">
              <el-space wrap size="default">
                <a v-if="userBasic.gitee" :href="userBasic.gitee" target="_blank">
                  <div class="diamond-clip-path diamond-icon">
                    <svg-icon icon-class="gitee"></svg-icon>
                  </div>
                </a>
                <a :href="userBasic.github" target="_blank">
                  <div class="diamond-clip-path diamond-icon">
                    <svg-icon icon-class="github"></svg-icon>
                  </div>
                </a>
                <a v-if="userBasic.qqNumber" :href="openQQ(userBasic.qqNumber)" target="_blank">
                  <div class="diamond-clip-path diamond-icon">
                    <svg-icon icon-class="qq"></svg-icon>
                  </div>
                </a>
                <el-link :underline="false" v-if="userBasic.weChat" @click="open(userBasic.weChat)">
                  <div class="diamond-clip-path diamond-icon">
                    <svg-icon icon-class="wechat"></svg-icon>
                  </div>
                </el-link>
              </el-space>
            </div>

            <div style="display: inline-flex; vertical-align: top; justify-content: space-between">
              <el-space fill direction="vertical">
                <div class="text-sm text-color">文章</div>
                <div class="text-xl font-number">{{ userBasic.articleCount }}</div>
              </el-space>
              <el-space fill direction="vertical">
                <div class="text-sm text-color">分类</div>
                <div class="text-xl font-number">{{ userBasic.categoryCount }}</div>
              </el-space>
              <el-space fill direction="vertical" size="small">
                <div class="text-sm text-color">标签</div>
                <div class="text-xl font-number">{{ userBasic.tagsCount }}</div>
              </el-space>
              <el-space fill direction="vertical" size="small">
                <div class="text-sm text-color">评论</div>
                <div class="text-xl font-number">{{ userBasic.messageCount }}</div>
              </el-space>
            </div>
          </el-space>
        </div>-->
      </el-card>
      <el-card class="box-card" shadow="hover">
        <template #header>
          <h2 class="text-lg" style="margin: 0">
            <svg-icon icon-class="tags"></svg-icon>
            目录
          </h2>
        </template>
        <div
          v-for="anchor in titles"
          :style="{ padding: `10px 0 10px ${anchor.indent * 20}px` }"
          @click="handleAnchorClick(anchor)"
        >
          <el-link :underline="false">{{ anchor.title }}</el-link>
        </div>
      </el-card>
    </el-space>
  </el-col>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { article, articleLike, listArticles } from '@/api/show'
import comments from '@/components/comments/index.vue'
import { image } from '@/utils/publicMethods'
import { addComment, deleteComment, getCommentTree } from '@/api/comment'
import useStore from '@/store'
import {AxiosResponse} from "axios";

// 文章详情
const articleOne = ref({
  id: 0,
  title: '',
  content: '',
  cover: '',
  isOriginal: 0,
  originalUrl: '',
  clickCount: 0,
  upvoteCount: 0,
  collectCount: 0,
  createTime: '',
  categoryId: 0,
  categoryName: '',
  clickLike: 0,
  username: '',
  userAvatar: '',
  tagsId: []
})

const route = useRoute()
const titles = ref()
const preview = ref()
const router = useRouter()
const store = useStore()
// 标签列表
const { tags } = store
// 展示文章列表
const dataList = ref([])
// 评论数
const commentCount = ref()
// 是否展示加载更多
const loadMores = ref(true)

const queryParams = ref({
  currentPage: 1,
  pageSize: 3,
  type: 6,
  id: 0
})
const config = ref({
  dataList: [],
  disabled: false,
  articleId: route.params.id
})

const commentQueryParams = ref({
  currentPage: 1,
  pageSize: 5,
  articleId: Number(route.params.id),
  source: 'ARTICLE'
})

// 查询展示推荐列表
function getList(categoryId: any) {
  queryParams.value.id = categoryId
  listArticles(queryParams.value).then((response) => {
    dataList.value = response.data.records
  })
}

// 页面跳转
function getArticleId(id: any) {
  router.push({ path: `/article/${id}` })
}

// 点赞
function clickLike(val: any) {
  const params: any = {
    articleId: val.id,
    clickLike: val.clickLike == null || val.clickLike === 0 ? 1 : 0
  }
  articleLike(params).then((res: any) => {
    if (res.data.code === 200) {
      ;(articleOne.value as any).clickLike = (articleOne.value as any).clickLike === 1 ? 0 : 1
      if ((articleOne.value as any).clickLike === 1) {
        // 点赞
        ;(articleOne.value as any).upvoteCount += 1
      } else {
        // 取消点赞
        ;(articleOne.value as any).upvoteCount -= 1
      }
    }
  })
}

// 获取文章详情
const getArticle = async () => {
  await article(route.params.id).then((res: any) => {
    articleOne.value = res.data
    // 文章内图片地址替换
    getList(res.data.categoryId)
  })
}

// 跳转到指定位置
const handleAnchorClick = (anchor: any) => {
  const { lineIndex } = anchor
  const heading = preview.value.$el.querySelector(`[data-v-md-line="${lineIndex}"]`)
  if (heading) {
    preview.value.scrollToTarget({
      target: heading,
      scrollContainer: window,
      top: 80
    })
  }
}

// 目录生成方法
async function getCatalog() {
  await getArticle()
  const anchors = preview.value.$el.querySelectorAll('h1,h2,h3,h4,h5,h6')
  const filterTitles = Array.from(anchors).filter((title: any) => !!title.innerText.trim())
  if (!filterTitles.length) {
    titles.value = []
    return
  }
  const hTags = Array.from(new Set(filterTitles.map((title: any) => title.tagName))).sort()
  titles.value = filterTitles.map((el: any) => ({
    title: el.innerText,
    lineIndex: el.getAttribute('data-v-md-line'),
    indent: hTags.indexOf(el.tagName)
  }))
}

// 加载更多
function loadMore() {
  const a = Math.ceil(commentCount.value / commentQueryParams.value.pageSize)
  if (commentQueryParams.value.currentPage + 1 >= a) {
    loadMores.value = false
  }
  if (commentQueryParams.value.currentPage + 1 <= a) {
    commentQueryParams.value.currentPage = 1 + commentQueryParams.value.currentPage
    getCommentTree(commentQueryParams.value).then((res) => {
      config.value.dataList = [...config.value.dataList, ...(res.data.records as [])]
    })
  }
}

// 获取评论
function getListComment() {
  getCommentTree(commentQueryParams.value).then((res) => {
    commentCount.value = res.data.total
    const a = Math.ceil(commentCount.value / queryParams.value.pageSize)
    loadMores.value = queryParams.value.currentPage + 1 <= a
    const array = res.data.records
    for (let i = 0; i < array.length; i++) {
      ;(array[i] as any).replyInputShow = false
    }
    config.value.dataList = array
    config.value.disabled = true
  })
}

// 评论
function submitComments(val: any) {
  const data: any = {
    toId: val.toId,
    articleId: val.articleId,
    content: val.content,
    source: 'ARTICLE'
  }
  addComment(data).then((res: any) => {
    getListComment()
    ElMessage.success(res.message)
  })
}

// 删除评论
function vanishDelete(val: any) {
  const data: any = {
    id: val.id
  }
  deleteComment(data).then((res: any) => {
    getListComment()
    ElMessage.success(res.message)
  })
}

onBeforeMount(async () => {
  // 监听$route对象上的参数属性变化
  watch(
    () => route.params.id,
    (newId, oldId) => {
      if (newId !== oldId) {
        // 如果发生变化重新载入
        window.location.reload()
      }
    }
  )
  await getCatalog()
})

getListComment()
</script>

<style scoped>
.box-card {
  padding: 0;
  border-radius: 10px;
  border: 1px solid transparent;
}

.tip {
  padding: 10px;
  margin: 20px auto 15px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  color: #888;
}

.image {
  width: 100%;
  height: 170px;
  display: block;
}

.panThumb {
  height: 100px !important;
  width: 100px !important;
  position: absolute !important;
  top: 115px;
  border: 5px solid #ffffff;
}

.image-hot:hover {
  transform: scale(1.1);
}

.image:hover {
  transform: scale(1.1);
}

/*样式穿透 md文件*/
>>> .github-markdown-body {
  padding: 0;
}
</style>
