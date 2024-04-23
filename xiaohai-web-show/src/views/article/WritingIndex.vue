<template>
  <el-col :lg="23" :xl="23">
    <div class="app-container" style="padding: 0 20px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-weight: 600; font-size: 20px">{{ title }}</span>
          <el-button style="float: right" type="primary" @click="submitForm">保 存</el-button>
        </div>
        <el-divider />
        <!-- 添加或修改参数配置对话框 -->
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="16">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" style="width: 100%" placeholder="请输入标题" />
                  </el-form-item>
                </el-col>
                <el-col :span="15">
                  <el-form-item label="简介" prop="summary">
                    <el-input v-model="form.summary" style="width: 100%" placeholder="请输入简介" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="分类" prop="categoryId">
                    <el-select
                      v-model="form.categoryId"
                      placeholder="分类"
                      clearable
                      @clear="form.categoryId = null"
                    >
                      <el-option
                        v-for="category in CategoryList"
                        :key="category.id"
                        :label="category.name"
                        :value="category.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="标签" prop="tags">
                    <el-select
                      v-model="form.tags"
                      placeholder="标签"
                      clearable
                      multiple
                      @clear="form.tags = []"
                    >
                      <el-option
                        v-for="tag in TagsList"
                        :key="tag.id"
                        :label="tag.name"
                        :value="tag.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="发布" prop="isPublish">
                    <el-radio
                      v-for="(item, index) in isPublish"
                      :key="index"
                      v-model="form.isPublish"
                      :label="index"
                      border
                      >{{ item }}</el-radio
                    >
                  </el-form-item>
                </el-col>
                <!--                <el-col :span="8">-->
                <!--                  <el-form-item label="类型" prop="isOriginal">-->
                <!--                    <el-radio-->
                <!--                      v-for="(item, index) in isOriginal"-->
                <!--                      :key="index"-->
                <!--                      v-model="form.isOriginal"-->
                <!--                      :label="index"-->
                <!--                      border-->
                <!--                      >{{ item }}</el-radio-->
                <!--                    >-->
                <!--                  </el-form-item>-->
                <!--                </el-col>-->
                <!--                <el-col :span="8">-->
                <!--                  <el-form-item v-if="form.isOriginal === 1" label="转载地址" prop="originalUrl">-->
                <!--                    <el-input v-model="form.originalUrl" placeholder="请输入转载地址" />-->
                <!--                  </el-form-item>-->
                <!--                </el-col>-->
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-form-item />
              <el-form-item prop="cover">
                <template #label>
                  封面
                  <div style="margin: 0 5px">
                    <el-popover placement="bottom" width="180" trigger="hover">
                      <template #reference>
                        <el-icon><QuestionFilled /></el-icon>
                      </template>
                      <template #default>
                        <div style="margin: 0">
                          随机获取一张图片
                          <el-button type="text" @click="randomImg()">确定</el-button>
                        </div>
                      </template>
                    </el-popover>
                  </div>
                </template>
                <div class="user-info-head">
                  <el-upload
                    class="avatar-uploader"
                    action="h"
                    :show-file-list="false"
                    :http-request="requestUpload"
                    :before-upload="uploadSectionFile"
                  >
                    <el-image v-if="form.cover" :src="form.cover" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">内容</el-divider>
          <div style="height: calc((100vh - 480px) - 1rem)">
            <mavon-editor
              ref="md"
              v-model="form.content"
              style="height: 100%; width: 100%"
              placeholder="输入文章内容..."
              font-size="18px"
              @save="submitForm"
              @imgAdd="imgAdd"
              @imgDel="imgDel"
            />
          </div>
        </el-form>
      </el-card>
    </div>
  </el-col>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Plus, QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { article, listCategory, listTag } from '@/api/show'
import { deleteImage, uploadImage } from '@/api/file'
import { addArticle, updateArticle } from '@/api/article'

const title = ref('新文章')
// const isOriginal = ref(['原创', '转载'])
const isPublish = ref(['草稿', '发布'])
const formRef = ref()
const TagsList = ref<any[]>([])
const CategoryList = ref<any[]>([])
const route = useRoute()
const router = useRouter()

const rules = {
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  summary: [{ required: true, message: '请输入简介', trigger: 'blur' }],
  categoryId: [{ required: true, message: '分类不能为空', trigger: 'blur' }],
  tags: [{ required: true, message: '标签不能为空', trigger: 'blur' }],
  isPublish: [{ required: true, message: '发布不能为空', trigger: 'blur' }]
  // isOriginal: [{ required: true, message: '类型不能为空', trigger: 'blur' }]
}
const form = ref({
  id: null,
  title: '',
  cover: '',
  content: '',
  categoryId: null,
  tags: [],
  isPublish: null,
  // isOriginal: null,
  // originalUrl: '',
  summary: ''
})

// 获取分类
const getCategory = () => {
  listCategory().then((response: any) => {
    CategoryList.value = response.data
  })
}

// 获取标签
const getTags = () => {
  listTag().then((response: any) => {
    TagsList.value = response.data
  })
}

// 获取文章
const getArticle = () => {
  const { id } = route.params
  if (!id) {
    return
  }
  article(id).then((response: any) => {
    form.value = response.data
    title.value = form.value.title
  })
}

// 随机图片
const randomImg = () => {
  // getBingWallpaper().then((response) => {
  //   form.cover = response.data;
  //   this.$message.success(response.message);
  // });
}
// 覆盖默认的上传行为
function requestUpload() {}
// 上传图片
const uploadSectionFile = (file: any) => {
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
  uploadImage(formParams).then((response: any) => {
    form.value.cover = response.data
  })
}

// 添加图片
const imgAdd = (pos: any, $file: any) => {
  const data = new FormData()
  data.append('file', $file)
  uploadImage(data).then((response: any) => {
    // this.$refs.md.$img2Url(pos, response.data);
  })
}

// 删除图片
const imgDel = (filename: any) => {
  const name = filename[0].split('/')
  const fileName = name[name.length - 1]
  deleteImage(fileName).then(() => {})
}

// 提交表单
const submitForm = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    if (form.value.cover === '') {
      ElMessage.error('请上传封面')
      return
    }
    if (form.value.content === '') {
      ElMessage.error('请填写文章内容')
      return
    }
    if (form.value.id === null) {
      addArticle(form.value).then(() => {
        ElMessage.success('发布成功')
      })
    } else {
      updateArticle(form.value).then(() => {
        ElMessage.success('修改成功')
      })
    }
    router.push('/')
  })
}

getArticle()
getCategory()
getTags()
</script>
<style scoped>
.user-info-head {
  position: relative;
  display: inline-block;
  width: 238px;
  height: 140px;
  border: 1px dashed #c0ccda;
}

.avatar-uploader-icon {
  width: 238px;
  height: 140px;
}

.user-info-head .avatar:hover:after {
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
  line-height: 140px;
}
</style>
