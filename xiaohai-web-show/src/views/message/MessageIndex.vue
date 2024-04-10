<template>
  <!--左内容区-->
  <el-col :lg="14" :xl="11">
    <h1 class="flex-center">
      <el-icon><Comment /></el-icon> 留言板
    </h1>
    <el-card class="el-card-d" shadow="always">
      <comments
        v-if="config.disabled"
        :config="config"
        :headValue="headValue"
        :listValue="listValue"
        @getListComment="getListComment"
        @submitComments="submitComments"
        @vanishDelete="vanishDelete"
      ></comments
    ></el-card>
  </el-col>
  <!--右内容区-->
  <el-col class="hidden-md-and-down" :lg="6" :xl="5">
    <RightSide></RightSide>
  </el-col>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Comment } from '@element-plus/icons-vue'
import comments from '@/components/comments/index.vue'
import RightSide from '@/components/layouts/RightSide.vue'
import { addComment, deleteComment, getCommentTree } from '@/api/comment'

const headValue = ref('')
const listValue = ref('全部留言')

const config = ref({
  dataList: [],
  disabled: false,
  articleId: '0'
})

const queryParams = ref({
  currentPage: 1,
  pageSize: 10,
  source: 'MESSAGE_BOARD'
})

// 获取评论
function getListComment() {
  getCommentTree(queryParams.value).then((res) => {
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
    content: val.content,
    source: 'MESSAGE_BOARD'
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

getListComment()
</script>

<style scoped>
.box-card {
  padding: 0;
  border-radius: 10px;
  border: 1px solid transparent;
}
</style>
