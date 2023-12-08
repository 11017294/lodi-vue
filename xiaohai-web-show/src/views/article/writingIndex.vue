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
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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
                        v-for="tags in CategoryList"
                        :key="tags.id"
                        :label="tags.name"
                        :value="tags.id"
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
                <el-col :span="8">
                  <el-form-item label="顶置" prop="isTop">
                    <el-radio
                      v-for="(item, index) in isTop"
                      :key="index"
                      v-model="form.isTop"
                      :label="index"
                      border
                      >{{ item }}</el-radio
                    >
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="发布" prop="isPush">
                    <el-radio
                      v-for="(item, index) in isPush"
                      :key="index"
                      v-model="form.isPush"
                      :label="index"
                      border
                      >{{ item }}</el-radio
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="类型" prop="isOriginal">
                    <el-radio
                      v-for="(item, index) in isOriginal"
                      :key="index"
                      v-model="form.isOriginal"
                      :label="index"
                      border
                      >{{ item }}</el-radio
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item v-if="form.isOriginal === 1" label="转载地址" prop="originalUrl">
                    <el-input v-model="form.originalUrl" placeholder="请输入转载地址" />
                  </el-form-item>
                </el-col>
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
                <el-upload
                  drag
                  class="image-upload-pic"
                  action="#"
                  :show-file-list="false"
                  :http-request="uploadSectionFile"
                >
                  <el-image
                    v-if="form.cover"
                    fit="cover"
                    :src="form.cover"
                    class="el-upload-dragger"
                  />
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">内容</el-divider>
          <div style="height: calc((100vh - 480px) - 1rem)">
            <mavon-editor
              ref="md"
              v-model="form.text"
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

<script>
import { InfoFilled, QuestionFilled, UploadFilled } from '@element-plus/icons-vue'
import { getArticleByTagId, listCategory, listTag } from '@/api/show.ts'
import { deleteImage, uploadImage } from '@/api/file.ts'

export default {
  name: 'WritingIndex',
  components: { InfoFilled, QuestionFilled, UploadFilled },
  data() {
    return {
      // 标题
      title: '新文章',
      isOriginal: ['原创', '转载'],
      isPush: ['草稿', '发布'],
      isTop: ['否', '是'],
      // 标签下拉选
      TagsList: [],
      // 分类下拉选
      CategoryList: [],
      // 表单校验
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        summary: [{ required: true, message: '请输入简介', trigger: 'blur' }],
        categoryId: [{ required: true, message: '分类不能为空', trigger: 'blur' }],
        tags: [{ required: true, message: '标签不能为空', trigger: 'blur' }],
        isTop: [{ required: true, message: '顶置不能为空', trigger: 'blur' }],
        isPush: [{ required: true, message: '发布不能为空', trigger: 'blur' }],
        isOriginal: [{ required: true, message: '类型不能为空', trigger: 'blur' }]
      },
      form: {
        id: '',
        title: '',
        cover: '',
        text: '',
        categoryId: '',
        tags: [],
        isPush: '',
        isTop: '',
        isOriginal: '',
        originalUrl: ''
      }
    }
  },
  created() {
    this.getCategory()
    this.getTags()
    this.getArticle()
  },
  methods: {
    /**
     * 查询分类下拉选
     */
    getCategory() {
      listCategory().then((response) => {
        this.CategoryList = response.data.data
      })
    },
    /**
     * 获取标签选择列表
     */
    getTags() {
      listTag().then((response) => {
        this.TagsList = response.data.data
      })
    },
    getArticle() {
      const { id } = this.$route.query
      if (id) {
        getArticleByTagId(id).then((response) => {
          this.form = response.data.data
          this.title = this.form.title
        })
      }
    },
    // 随机照片
    randomImg() {
      // getBingWallpaper().then((response) => {
      //   this.form.cover = response.data.data
      //   this.$message.success(response.data.msg)
      // })
    },
    // 覆盖默认的上传行为
    uploadSectionFile(params) {
      const { file } = params
      const fileType = file.type
      const isImage = fileType.indexOf('image') !== -1
      const isLt2M = file.size / 1024 / 1024 < 2
      // 这里常规检验，看项目需求而定
      if (!isImage) {
        this.$message.error('只能上传图片格式png、jpg、gif!')
        return
      }
      if (!isLt2M) {
        this.$message.error('只能上传图片大小小于2M')
        return
      }
      // 根据后台需求数据格式
      const form = new FormData()
      // 文件对象
      form.append('file', file)
      uploadImage(form).then((response) => {
        this.$message.success(response.data.msg)
        this.form.cover = response.data.data
      })
    },
    // 绑定@imgAdd event
    imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      const data = new FormData()
      data.append('file', $file)
      uploadImage(data).then((response) => {
        this.$message.success(response.data.msg)
        /**
         * $vm 指为mavonEditor实例，可以通过如下两种方式获取
         * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
         * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
         */
        this.$refs.md.$img2Url(pos, response.data.data)
      })
    },
    // 删除图片
    imgDel(filename) {
      const name = filename[0].split('/')
      const fileName = name[name.length - 1]
      deleteImage(fileName).then((response) => {
        this.$message.success(response.data.msg)
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.cover === '') {
            this.$message.error('请上传封面')
            return
          }
          if (this.form.text === '') {
            this.$message.error('请填写文章内容')
            return
          }
          this.form.cover = this.form.cover.replaceAll(process.env.VUE_APP_BASE_API_FILE, '')
          this.form.text = this.form.text.replaceAll(process.env.VUE_APP_BASE_API_FILE, '..')
          if (this.form.id !== '') {
            // updateArticle(this.form).then((response) => {
            //   this.$message.success(response.msg)
            //   this.$router.push('/note/article')
            // })
          } else {
            // addArticle(this.form).then((response) => {
            //   this.$message.success(response.msg)
            //   this.$router.push('/note/article')
            // })
          }
        }
      })
    }
  }
}
</script>
<style scoped></style>
