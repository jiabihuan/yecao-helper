<template>
  <div class="settings-root">
    <div class="settings-container">
      <qt-text class="settings-title" text="设置" gravity="center" :fontSize="40" typeface="bold" />
      
      <div class="settings-item">
        <qt-text class="settings-label" text="服务器地址" :fontSize="28" />
        <div class="settings-input-wrapper">
          <qt-text class="settings-input" :text="serverUrl" :fontSize="26" />
        </div>
        <qt-text class="settings-hint" text="格式: http://your-server.com:端口" :fontSize="22" />
      </div>

      <div class="settings-actions">
        <div
          class="settings-btn btn-primary"
          :focusable="true"
          :focusScale="1.05"
          @click="onSave"
        >
          <qt-text text="保存设置" gravity="center" :fontSize="30" typeface="bold" />
        </div>
        <div
          class="settings-btn btn-secondary"
          :focusable="true"
          :focusScale="1.05"
          @click="onBack"
        >
          <qt-text text="返回" gravity="center" :fontSize="28" />
        </div>
      </div>

      <div class="settings-about">
        <qt-text class="about-title" text="关于星河助手" gravity="center" :fontSize="26" typeface="bold" />
        <qt-text class="about-text" text="版本 1.0.0" gravity="center" :fontSize="22" />
        <qt-text class="about-text" text="让大屏应用安装更简单" gravity="center" :fontSize="22" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import { useESLocalStorage } from '@extscreen/es3-core'
import { setBaseUrl } from '../../api/yecao/config'

defineOptions({ name: 'yecao-settings' })

const router = useESRouter()
const localStorage = useESLocalStorage()

const serverUrl = ref('http://172.245.61.121:3000')

const onESCreate = () => {
  const savedUrl = localStorage.getItem('xinghe_server_url')
  if (savedUrl) {
    serverUrl.value = savedUrl
  }
}

function onSave() {
  localStorage.setItem('xinghe_server_url', serverUrl.value)
  setBaseUrl(serverUrl.value)
  router.back()
}

function onBack() {
  router.back()
}

const onBackPressed = () => {
  router.back()
  return true
}

defineExpose({ onESCreate, onBackPressed })
</script>

<style lang="scss" scoped>
.settings-root {
  width: 1920px;
  height: 1080px;
  background-color: #0f3460;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.settings-container {
  width: 700px;
  flex-direction: column;
  padding: 50px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
}

.settings-title {
  color: #ffffff;
  margin-bottom: 40px;
}

.settings-item {
  flex-direction: column;
  margin-bottom: 35px;
}

.settings-label {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
}

.settings-input-wrapper {
  width: 100%;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding-left: 15px;
  padding-right: 15px;
  justify-content: center;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.2);
}

.settings-input {
  color: #ffffff;
}

.settings-hint {
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8px;
}

.settings-actions {
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.settings-btn {
  width: 280px;
  height: 56px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
}

.btn-primary {
  background-color: #667eea;
  
  :deep(qt-text) {
    color: #ffffff;
  }
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.1);
  
  :deep(qt-text) {
    color: rgba(255, 255, 255, 0.8);
  }
}

.settings-about {
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  padding-top: 30px;
  border-top-width: 1px;
  border-top-color: rgba(255, 255, 255, 0.1);
}

.about-title {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
}

.about-text {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 6px;
}
</style>
