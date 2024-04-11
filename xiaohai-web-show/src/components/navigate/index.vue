<template>
  <div class="flex flex-wrap gap-4">
    <el-row :gutter="10">
      <div class="dataList" v-for="(item, index) in dataList" :key="index">
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <el-tooltip :content="item.summary || '站长很懒，什么都没留下...'" placement="bottom">
            <el-card class="responsive-card" shadow="hover">
              <div class="card-content">
                <a target="_blank" :href="item.url">
                  <div class="card-left">
                    <img :src="image(item.faviconUrl)" class="card-image" />
                  </div>
                  <div class="card-right">
                    <div class="card-title">{{ item.title }}</div>
                    <div class="card-subtitle">{{ item.summary }}</div>
                  </div>
                </a>
              </div>
            </el-card>
          </el-tooltip>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { toRefs, watch } from 'vue'
import { image } from '@/utils/publicMethods'

const props = defineProps({
  config: {
    type: Object,
    default: {}
  }
})

const { config } = toRefs(props)
const { dataList } = toRefs(props.config)
watch(
  () => config.value,
  () => {
    dataList.value = config.value.dataList
  },
  { deep: true }
)
</script>

<style scoped>
.responsive-card {
  width: 220px;
  margin: 10px;
  transition: transform 0.2s ease-in-out; /* 过度动画 */
  --el-card-padding: 12px; /* 内间距 */
  border-radius: 10px; /* 圆角 */
}

.responsive-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影 */
  transform: translateY(-5px); /* 悬停时将卡片向上移动5px */
  color: #ff6d6d;
}

.card-content {
  justify-content: center; /* 在父容器中水平居中 */
}

.card-content a {
  text-decoration: none; /* 去除下划线 */
  color: inherit; /* 继承父元素的颜色 */
}

.card-left {
  justify-content: center; /* 垂直居中 */
  text-align: center; /* 水平居中 */
}

.card-right {
  justify-content: center; /* 垂直居中 */
  text-align: center; /* 水平居中 */
}

.card-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.card-title {
  font-size: 14px;
  line-height: 20px;
  font-weight: bold;
}

.card-subtitle {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  line-height: 20px;
  color: #999;
}
</style>
