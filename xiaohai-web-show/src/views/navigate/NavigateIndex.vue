<template>
  <div>
    <navigate :config="config"></navigate>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import navigate from '@/components/navigate/index.vue'

const config = ref({
  dataList: [
    {
      title: '在线备忘录',
      summary: '在线备忘录',
      url: 'http://www.bigchen.icu/navigation',
      faviconUrl: 'http://www.123moe.net/wp-content/uploads/2022/10/123moe.png'
    },
    {
      title: 'ACG',
      summary: 'ACG盒子',
      url: 'http://www.bigchen.icu/navigation',
      faviconUrl: 'http://www.123moe.net/wp-content/uploads/2022/10/123moe.png'
    },
    {
      title: '摸鱼导航',
      summary: '摸鱼导航 | 资源聚合站',
      url: 'http://www.bigchen.icu/navigation',
      faviconUrl: 'http://www.123moe.net/wp-content/uploads/2022/10/123moe.png'
    },
    {
      title: '艾特导航',
      summary: '艾特导航',
      url: 'http://www.bigchen.icu/navigation',
      faviconUrl: 'http://www.123moe.net/wp-content/uploads/2022/10/123moe.png'
    }
  ]
})
</script>

<style scoped></style>
