<template>
  <div class="space-centered">
    <el-card shadow="never" class="box-top">
      <div class="user-info">
        <img :src="userInfo.userAvatar" alt="User Avatar" class="avatar" />
        <div class="user-details">
          <div class="username">{{ userInfo.nickname }}</div>
          <div class="summary">{{ userInfo.summary || '这个人很懒，什么都没有留下...' }}</div>
        </div>
      </div>
      <div class="navigation">
        <el-tabs tab-position="bottom" v-model="activeName">
          <el-tab-pane label="文章" :name="tabName.article"></el-tab-pane>
          <el-tab-pane label="收藏" :name="tabName.collect"></el-tab-pane>
          <el-tab-pane label="评论" :name="tabName.comment" v-if="isShow"></el-tab-pane>
          <el-tab-pane label="个人资料" :name="tabName.info"></el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <el-card shadow="never" class="tab-content">
      <template v-if="tabName.article == activeName">
        <ArticleIndex />
      </template>
      <template v-else-if="tabName.collect == activeName">
        <CollectIndex />
      </template>
      <template v-else-if="tabName.comment == activeName && isShow">
        <CommentIndex />
      </template>
      <template v-else-if="tabName.info == activeName">
        <InfoIndex />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ArticleIndex from '@/views/space/ArticleIndex.vue'
import CollectIndex from '@/views/space/CollectIndex.vue'
import CommentIndex from '@/views/space/CommentIndex.vue'
import InfoIndex from '@/views/space/InfoIndex.vue'
import { getUserInfo } from '@/api/user'
import useStore from '@/store'

const store = useStore()

const tabName = ref({
  article: 'article',
  collect: 'collect',
  comment: 'comment',
  info: 'info'
})
const route = useRoute()
const userInfo = ref({})
const activeName = ref(tabName.value.info)
const isShow = ref(false)

// 获取用户信息
function getUser() {
  const userId = route.params.id || store.userId
  if (!route.params.id) {
    isShow.value = true
  }
  getUserInfo(userId).then((res) => {
    userInfo.value = res.data
  })
}

getUser()
</script>

<style scoped>
.space-centered {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.box-top,
.tab-content {
  padding-left: 26px;
  width: 80%;
  max-width: 1200px;
  min-width: 1100px;
}

.box-top {
  padding-left: 26px;
  position: relative;
  height: 150px;
  margin-bottom: 15px;

  .user-info {
    position: absolute;
    bottom: 50px;
    display: flex;
    align-items: center;

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .user-details {
      display: flex;
      flex-direction: column;

      .username {
        font-weight: bold;
      }

      .summary {
        font-size: 12px;
        color: gray;
      }
    }
  }

  .navigation {
    position: absolute;
    bottom: 5px;
    width: 100%;
    display: flex;

    /* 去掉切换时el-tab-pane底部的蓝色下划线 */
    >>> .el-tabs__active-bar {
      background-color: transparent !important;
    }

    /* 去掉tabs底部的下划线 */
    >>> .el-tabs__nav-wrap::after {
      position: static !important;
    }
  }
}
</style>
