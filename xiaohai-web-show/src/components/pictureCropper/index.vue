<template>
  <div>
    <div class="user-info-head" @click="open = true">
      <el-avatar v-if="options.img" shape="circle" :size="120" :src="options.img" />
      <el-avatar v-else shape="circle" :size="120"> {{ options.username }} </el-avatar>
    </div>
    <div></div>
    <el-dialog
      v-model="open"
      :title="title"
      :visible.sync="open"
      width="850px"
      append-to-body
      @opened="visible = true"
      @close="closeDialog()"
    >
      <el-row>
        <el-col :xs="24" :md="12" :style="{ height: '280px' }">
          <VueCropper
            v-if="visible"
            ref="cropper"
            :img="options.img"
            :info="options.info"
            :output-size="options.outputSize"
            :output-type="options.outputType"
            :auto-crop="options.autoCrop"
            :auto-crop-width="options.autoCropWidth"
            :auto-crop-height="options.autoCropHeight"
            :fixed-box="options.fixedBox"
            :center-box="options.centerBox"
            :can-move-box="options.canMoveBox"
            @real-time="realTime"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{ height: '280px' }">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload
            action="#"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <el-button size="small">
              选择
              <el-icon><UploadFilled /></el-icon>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{ span: 1, offset: 2 }" :md="2">
          <el-button size="small" @click="changeScale(1)">
            <el-icon><Plus /></el-icon>
          </el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button size="small" @click="changeScale(-1)">
            <el-icon><Minus /></el-icon>
          </el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button size="small" @click="rotateLeft()">
            <el-icon><RefreshLeft /></el-icon>
          </el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button size="small" @click="rotateRight()">
            <el-icon><RefreshRight /></el-icon>
          </el-button>
        </el-col>
        <el-col :lg="{ span: 2, offset: 6 }" :md="2">
          <el-button type="primary" size="small" @click="uploadImg()">提 交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'

import { reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { Minus, Plus, RefreshLeft, RefreshRight, UploadFilled } from '@element-plus/icons-vue'

const props = defineProps({
  userInfo: {
    type: Object,
    default: {}
  },
  autoCrop: {
    type: Object,
    default: {}
  }
})
const { userInfo, autoCrop } = toRefs(props)
const emit = defineEmits(['avatarUpload'])

const cropper = ref<InstanceType<typeof VueCropper>>()

const data = reactive({
  options: {
    img: userInfo.value.userAvatar, // 裁剪图片的地址
    outputSize: 1, // 裁剪生成图片的质量 0.1 - 1
    outputType: 'png', //	裁剪生成图片的格式 jpeg || png || webp
    autoCropWidth: autoCrop.value.width, // 默认生成截图框宽度
    autoCropHeight: autoCrop.value.height, // 默认生成截图框高度
    info: true, // 裁剪框的大小信息
    autoCrop: true, // 是否默认生成截图框
    fixedBox: true, // 固定截图框大小 不允许改变
    centerBox: true, // 截图框是否被限制在图片里面
    canMoveBox: false // 截图框能否拖动
  }
})

const { options } = data

// 是否显示弹出层
const open = ref(false)
// 是否显示cropper
const visible = ref(false)
// 弹出层标题
const title = ref('上传图片')
// 图片预览
const previews = ref({})

// 覆盖默认的上传行为
function requestUpload() {}
// 向左旋转
function rotateLeft() {
  cropper.value.rotateLeft()
}
// 向右旋转
function rotateRight() {
  cropper.value.rotateRight()
}
// 图片缩放
function changeScale(num: number) {
  cropper.value.changeScale(num || 1)
}

// 上传预处理
function beforeUpload(file: any) {
  const isLt2M = file.size / 1024 / 1024 < 4
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 4MB!')
  }
  if (file.type.indexOf('image/') === -1) {
    ElMessage.error('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
  } else {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      options.img = reader.result
    }
  }
}

// 关闭窗口
function closeDialog() {
  options.img = userInfo.value.userAvatar
  visible.value = false
}

// 实时预览
function realTime(data) {
  previews.value = data
}

// 上传图片
function uploadImg() {
  cropper.value.getCropBlob((data) => {
    emit('avatarUpload', data)
    open.value = false
  })
}
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

.avatar-upload-preview {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;
}
</style>
