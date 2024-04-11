<template>
  <div>
    <div class="nav-input" style="margin-top: 15px;">
      <el-select v-model="queryParams.navCategoryId" filterable clearable @change="search" placeholder="选择类型">
        <el-option
          v-for="item in navCategoryList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-input placeholder="请输入内容" v-model="queryParams.keyword" @keyup.enter.native="search" class="input-with-select" style="width: 280px">
      </el-input>
    </div>
    <navigate :config="config"></navigate>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import navigate from '@/components/navigate/index.vue'
import { getNavCategoryList, getNavList } from "@/api/navigate";

const navCategoryList = ref()
const config = ref({
  dataList: []
})

const oldKeyword = ref({
  navCategoryId: null,
  keyword: ''
})

const queryParams = ref({
  navCategoryId: null,
  keyword: ''
})

// 查询
function search() {
  // 防止重复请求
  if(queryParams.value == oldKeyword.value){
    return
  }
  oldKeyword.value.navCategoryId = queryParams.value.navCategoryId
  oldKeyword.value.keyword = queryParams.value.keyword
  getListComment()
}

// 获取评论
function getListComment() {
  getNavList(queryParams.value).then((res) => {
    config.value.dataList = res.data
  })
}

// 获取导航分类
function getNavCategory() {
  getNavCategoryList().then((res) => {
    navCategoryList.value = res.data
  })
}

getNavCategory()
getListComment()
</script>

<style scoped>
.nav-input {
  display: flex;
  justify-content: center;
}

.nav-input .el-select,
.nav-input .el-input {
  margin-right: 10px;
}
</style>
