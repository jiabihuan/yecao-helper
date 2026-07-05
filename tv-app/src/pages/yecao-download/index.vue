<template>
  <div class="download-root">
    <div class="download-container">
      <div class="download-icon">
        <qt-text :text="statusIcon" gravity="center" :fontSize="80" />
      </div>
      
      <qt-text class="download-title" :text="statusText" gravity="center" :fontSize="36" typeface="bold" />
      
      <div class="download-fileinfo">
        <qt-text class="download-filename" :text="fileName" gravity="center" :fontSize="28" />
        <qt-text class="download-filesize" :text="fileSizeText" gravity="center" :fontSize="24" />
      </div>

      <div v-if="showProgress" class="download-progress-container">
        <div class="download-progress-bar">
          <div class="download-progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <qt-text class="download-progress-text" :text="progress + '%'" gravity="center" :fontSize="26" />
      </div>

      <div class="download-status">
        <qt-text :text="statusDetail" gravity="center" :fontSize="24" />
      </div>

      <div v-if="showActions" class="download-actions">
        <div
          class="download-btn download-btn-primary"
          :focusable="true"
          :focusScale="1.05"
          @click="onPrimaryAction"
        >
          <qt-text :text="primaryActionText" gravity="center" :fontSize="30" typeface="bold" />
        </div>
        <div
          class="download-btn download-btn-secondary"
          :focusable="true"
          :focusScale="1.05"
          @click="onSecondaryAction"
        >
          <qt-text :text="secondaryActionText" gravity="center" :fontSize="28" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import { getDownloadUrl, formatFileSize } from '../../api/yecao'

defineOptions({ name: 'yecao-download' })

const router = useESRouter()

const code = ref('')
const fileName = ref('')
const fileSize = ref(0)
const progress = ref(0)
const status = ref<'downloading' | 'downloaded' | 'installing' | 'installed' | 'error'>('downloading')
const errorMsg = ref('')

const statusIcon = computed(() => {
  switch (status.value) {
    case 'downloading': return '⬇️'
    case 'downloaded': return '✅'
    case 'installing': return '📦'
    case 'installed': return '🎉'
    case 'error': return '❌'
    default: return '⬇️'
  }
})

const statusText = computed(() => {
  switch (status.value) {
    case 'downloading': return '正在下载'
    case 'downloaded': return '下载完成'
    case 'installing': return '正在安装'
    case 'installed': return '安装成功'
    case 'error': return '下载失败'
    default: return '正在下载'
  }
})

const statusDetail = computed(() => {
  switch (status.value) {
    case 'downloading': return '请稍候，正在下载应用安装包...'
    case 'downloaded': return '下载完成，点击开始安装'
    case 'installing': return '正在安装应用，请稍候...'
    case 'installed': return '应用已成功安装到您的设备'
    case 'error': return errorMsg.value
    default: return ''
  }
})

const fileSizeText = computed(() => formatFileSize(fileSize.value))

const showProgress = computed(() => status.value === 'downloading')
const showActions = computed(() => status.value === 'downloaded' || status.value === 'installed' || status.value === 'error')

const primaryActionText = computed(() => {
  switch (status.value) {
    case 'downloaded': return '安装应用'
    case 'installed': return '打开应用'
    case 'error': return '重试'
    default: return '确定'
  }
})

const secondaryActionText = computed(() => {
  return '返回'
})

function startDownload() {
  progress.value = 0
  status.value = 'downloading'
  
  const downloadUrl = getDownloadUrl(code.value)
  console.log('开始下载:', downloadUrl)
  
  simulateDownload()
}

function simulateDownload() {
  const total = 100
  let current = 0
  
  const interval = setInterval(() => {
    current += Math.random() * 8 + 2
    if (current >= total) {
      current = total
      clearInterval(interval)
      status.value = 'downloaded'
    }
    progress.value = Math.floor(current)
  }, 200)
}

function onPrimaryAction() {
  switch (status.value) {
    case 'downloaded':
      installApp()
      break
    case 'installed':
      console.log('打开应用')
      break
    case 'error':
      startDownload()
      break
  }
}

function onSecondaryAction() {
  router.back()
}

function installApp() {
  status.value = 'installing'
  
  setTimeout(() => {
    status.value = 'installed'
  }, 2000)
}

const onESCreate = (params: any) => {
  if (params?.query) {
    code.value = params.query.code || ''
    fileName.value = params.query.filename || '未知应用'
    fileSize.value = parseInt(params.query.size) || 0
  }
  
  if (code.value) {
    startDownload()
  }
}

const onBackPressed = () => {
  if (status.value === 'downloading') {
    return false
  }
  router.back()
  return true
}

defineExpose({ onESCreate, onBackPressed })
</script>

<style lang="scss" scoped>
.download-root {
  width: 1920px;
  height: 1080px;
  background-color: #0f3460;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.download-container {
  width: 600px;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
}

.download-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 25px;
  justify-content: center;
  align-items: center;
}

.download-title {
  color: #ffffff;
  margin-bottom: 20px;
}

.download-fileinfo {
  flex-direction: column;
  align-items: center;
  margin-bottom: 35px;
}

.download-filename {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
  max-width: 500px;
}

.download-filesize {
  color: rgba(255, 255, 255, 0.6);
}

.download-progress-container {
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.download-progress-bar {
  width: 100%;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.download-progress-fill {
  height: 100%;
  background-color: #667eea;
  border-radius: 6px;
}

.download-progress-text {
  color: #667eea;
}

.download-status {
  margin-bottom: 35px;
  
  :deep(qt-text) {
    color: rgba(255, 255, 255, 0.7);
  }
}

.download-actions {
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.download-btn {
  width: 300px;
  height: 60px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.download-btn-primary {
  background-color: #667eea;
  
  :deep(qt-text) {
    color: #ffffff;
  }
}

.download-btn-secondary {
  background-color: rgba(255, 255, 255, 0.1);
  
  :deep(qt-text) {
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>
