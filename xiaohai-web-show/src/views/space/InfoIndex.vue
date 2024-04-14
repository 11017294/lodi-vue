<template>
  <el-descriptions column="1" title="个人资料">
    <template #extra>
      <el-button type="primary" size="small" :icon="Edit" text>编辑</el-button>
    </template>
    <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
    <el-descriptions-item label="昵称">{{ userInfo.nickname }}</el-descriptions-item>
    <el-descriptions-item label="性别">
      <el-tag size="small" type="info" v-if="userInfo.gender === 0">未知</el-tag>
      <el-tag size="small" v-else-if="userInfo.gender === 1">男</el-tag>
      <el-tag size="small" type="danger" v-else-if="userInfo.gender === 2">女</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="邮箱">{{ userInfo.email || '暂无' }}</el-descriptions-item>
    <el-descriptions-item label="简介">{{ userInfo.summary || '暂无' }}</el-descriptions-item>
    <el-descriptions-item label="生日">{{ userInfo.birthday || '暂无' }}</el-descriptions-item>
    <el-descriptions-item label="注册日期">{{ userInfo.createTime }}</el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {getInfo} from "@/api/auth";
import {Edit} from "@element-plus/icons-vue";

const userInfo = ref({
  username: '',
  nickname: '',
  gender: 0,
  email: '',
  summary: '',
  birthday: '',
  createTime: null
})

function getUserInfo(){
  getInfo().then(res=>{
    userInfo.value = res.data
  })
}

getUserInfo()
</script>

<style scoped>

</style>
