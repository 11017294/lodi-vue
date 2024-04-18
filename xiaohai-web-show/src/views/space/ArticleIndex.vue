<template>
  <el-space class="hidden-sm-and-down" direction="vertical" fill size="large" style="display: flex">
    <el-card
      :body-style="{ padding: '0px' }"
      v-loading="loading"
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
          <span v-if="article.nickname" class="text-xs">
            <el-icon><Avatar /></el-icon>
            {{ article.nickname }}</span
          >
          <span v-else class="text-xs">{{ article.username }}</span>
          <el-icon><Grid /></el-icon>
          <el-tag size="small">{{ article.categoryName }}</el-tag>
          <span class="text-xs font-number text-color">
            <el-tag size="small" type="info" v-if="article.isPublish === 0">保密</el-tag>
            <el-tag size="small" type="success" v-else-if="article.isPublish === 1">公开</el-tag>
          </span>
          <span class="text-xs font-number text-color" v-if="article.isPublish === 1">
            <el-tag size="small" type="info" v-if="article.auditStatus === 0">未审核</el-tag>
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
        <el-space alignment="center" size="large">
          <div class="operate" style="margin-right: 18px">
            <el-tooltip content="浏览" placement="top">
              <el-button :icon="Search" @click="getArticle(article.id)" circle />
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button type="primary" :icon="Edit" @click="editArticle(article.id)" circle />
            </el-tooltip>
            <el-tooltip v-if="article.isPublish === 0" content="公布" placement="top">
              <el-button type="success" :icon="Open" circle />
            </el-tooltip>
            <el-tooltip v-else content="下架" placement="top">
              <el-button type="warning" :icon="TurnOff" circle />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" :icon="Delete" circle />
            </el-tooltip>
          </div>
        </el-space>
      </div>
    </el-card>
  </el-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {Avatar, Check, Delete, Edit, Grid, Open, Search, TurnOff} from '@element-plus/icons-vue'
import { getArticleByUserId } from '@/api/article'
import {editArticle, getArticle, image} from '@/utils/publicMethods'
import useStore from '@/store'

const store = useStore()

const loading = ref()
const dataList = ref({})

const queryParams = ref({
  currentPage: 1,
  pageSize: 10,
  id: store.userId
})

function getArticleList() {
  getArticleByUserId(queryParams.value).then((res: any) => {
    dataList.value = res.data.records
  })
}

getArticleList()
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
</style>
