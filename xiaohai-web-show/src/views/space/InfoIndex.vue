<template>
  <div>
    <el-descriptions :column="1" title="个人资料">
      <template #extra>
        <el-button type="primary" size="small" :icon="Edit" text @click="dialogVisible = true"
          >编辑</el-button
        >
      </template>
      <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
      <el-descriptions-item label="昵称">{{ userInfo.nickname }}</el-descriptions-item>
      <el-descriptions-item label="性别">
        <el-tag size="small" type="info" v-if="userInfo.gender === 0">未知</el-tag>
        <el-tag size="small" v-else-if="userInfo.gender === 1">男</el-tag>
        <el-tag size="small" type="danger" v-else-if="userInfo.gender === 2">女</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="邮件通知">
        <el-tag size="small" type="danger" v-if="userInfo.startEmailNotify === 0">关闭</el-tag>
        <el-tag size="small" type="success" v-else-if="userInfo.startEmailNotify === 1"
          >开启</el-tag
        >
      </el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ userInfo.email || '暂无' }}</el-descriptions-item>
      <el-descriptions-item label="简介">{{ userInfo.summary || '暂无' }}</el-descriptions-item>
      <el-descriptions-item label="生日">{{ userInfo.birthday || '暂无' }}</el-descriptions-item>
      <el-descriptions-item label="注册日期">{{ userInfo.createTime }}</el-descriptions-item>
    </el-descriptions>
    <!--  编辑  -->
    <el-dialog v-model="dialogVisible" @open="openEdit" @close="closeEdit" title="编辑" width="800">
      <el-form
        ref="editRef"
        :rules="editRules"
        :model="editUserInfo"
        label-width="auto"
        style="margin: 0 28px"
        class="edit-form"
      >
        <el-form-item prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="h"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editUserInfo.userAvatar" :src="editUserInfo.userAvatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称:" prop="nickname">
          <el-input v-model="editUserInfo.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="editUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="gender">
          <el-select v-model="editUserInfo.gender" style="width: 100%">
            <el-option label="保密" :value="0"></el-option>
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮件通知:" prop="startEmailNotify">
          <el-switch v-model="editUserInfo.startEmailNotify" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="生日:" prop="birthday">
          <el-date-picker
            v-model="editUserInfo.birthday"
            type="date"
            :clearable="false"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="个人简介:" prop="summary" style="height: 150px">
          <el-input
            type="textarea"
            v-model="editUserInfo.summary"
            rows="5"
            resize="none"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editUser">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getInfo } from '@/api/auth'
import { updateUserInfo, uploadAvatar } from '@/api/user'

const editRef = ref()

const userInfo = ref({
  id: null,
  username: '',
  nickname: '',
  userAvatar: '',
  gender: 0,
  email: '',
  summary: '',
  birthday: '',
  startEmailNotify: 0,
  createTime: null
})

const editUserInfo = ref({
  id: null,
  nickname: '',
  userAvatar: '',
  gender: 0,
  email: '',
  summary: '',
  startEmailNotify: 0,
  birthday: ''
})

const dialogVisible = ref(false)

// 获取用户信息
function getUserInfo() {
  getInfo().then((res) => {
    userInfo.value = res.data
  })
}

// 上传头像
function beforeAvatarUpload(file: any) {
  const fileType = file.type
  const isImage = fileType.indexOf('image') !== -1
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) {
    ElMessage.error('只能上传图片格式png、jpg、gif!')
    return
  }
  if (!isLt2M) {
    ElMessage.error('只能上传图片大小小于2M')
    return
  }
  const formParams = new FormData()
  formParams.append('file', file)
  uploadAvatar(formParams).then((response: any) => {
    editUserInfo.value.userAvatar = response.data
  })
}

const editRules = {
  nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
  userAvatar: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
  gender: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
  email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
  summary: [{ required: true, message: '简介不能为空', trigger: 'blur' }],
  birthday: [{ required: true, message: '生日不能为空', trigger: 'blur' }]
}

// 编辑用户信息
function openEdit() {
  Object.assign(editUserInfo.value, userInfo.value)
}

// 关闭编辑
function closeEdit() {
  Object.assign(editUserInfo.value, {})
}

// 编辑用户信息
const editUser = () => {
  editRef.value.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    updateUserInfo(editUserInfo.value).then(() => {
      getUserInfo()
      ElMessage.success('修改成功')
      dialogVisible.value = false
    })
  })
}

getUserInfo()
</script>

<style scoped>
.edit-form {
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}
</style>
