<template>
  <div>
    <el-descriptions :column="1" title="个人资料">
      <template #extra>
        <el-button
          type="primary"
          size="small"
          :icon="Edit"
          text
          @click="dialogVisible = true"
          v-if="store.userId === userInfo.id"
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
        <el-tag size="small" type="success" v-else-if="userInfo.startEmailNotify === 1">
          开启
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ userInfo.email || '暂无' }}</el-descriptions-item>
      <el-descriptions-item label="简介">{{ userInfo.summary || '暂无' }}</el-descriptions-item>
      <el-descriptions-item label="生日">{{ userInfo.birthday || '暂无' }}</el-descriptions-item>
      <el-descriptions-item label="注册日期">{{ userInfo.createTime }}</el-descriptions-item>
    </el-descriptions>
    <!--  编辑  -->
    <el-dialog
      v-model="dialogVisible"
      @open="openEdit"
      @close="closeEdit"
      title="编辑"
      width="800"
      v-if="store.userId === userInfo.id"
    >
      <el-form
        ref="editRef"
        :rules="editRules"
        :model="editUserInfo"
        label-width="auto"
        style="margin: 0 28px"
        class="edit-form"
      >
        <el-form-item label="头像:" prop="userAvatar">
          <div class="user-info-head" @click="childRef.isShow = true">
            <el-avatar
              v-show="editUserInfo.userAvatar"
              shape="circle"
              :size="120"
              :src="editUserInfo.userAvatar"
            />
          </div>
          <PictureCropper
            ref="childRef"
            :img="editUserInfo.userAvatar"
            :autoCrop="autoCrop"
            @avatarUpload="avatarUpload"
          />
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
          <el-switch
            v-model="editUserInfo.startEmailNotify"
            :active-value="1"
            :inactive-value="0"
          />
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
import { Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { getUserInfo, updateUserInfo, uploadAvatar } from '@/api/user'
import useStore from '@/store'
import PictureCropper from '@/components/pictureCropper/index.vue'

const route = useRoute()
const editRef = ref()
const dialogVisible = ref(false)
const store = useStore()

const childRef = ref(false)

// 图片裁剪大小
const autoCrop = ref({
  type: 1,
  width: 200,
  height: 200
})

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

// 获取用户信息
function getUser() {
  const userId = route.params.id || store.userId
  getUserInfo(userId).then((res) => {
    userInfo.value = res.data
    Object.assign(editUserInfo.value, userInfo.value)
  })
}

// 上传头像
function avatarUpload(file: any) {
  const formParams = new FormData()
  formParams.append('file', file)
  uploadAvatar(formParams).then((res: any) => {
    userInfo.value.userAvatar = res.data
    editUserInfo.value.userAvatar = res.data
    ElMessage.success('上传成功，提交后生效')
  })
}

const editRules = {
  nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
  userAvatar: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
  gender: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
  startEmailNotify: [{ required: true, message: '邮箱通知不能为空', trigger: 'blur' }],
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
      ElMessage.success('修改成功')
      window.location.reload()
      dialogVisible.value = false
    })
  })
}

getUser()
</script>

<style scoped>
.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover:after {
  display: flex; /* 添加Flexbox布局 */
  justify-content: center; /* 水平居中 */
  content: '+';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 120px;
  border-radius: 50%;
}

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
