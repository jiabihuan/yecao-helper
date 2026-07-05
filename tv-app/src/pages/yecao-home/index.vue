<template>
  <div class="home-root">
    <div class="home-container">
      <div class="home-logo">
        <qt-text text="✨" gravity="center" :fontSize="80" />
      </div>
      <qt-text class="home-title" text="星河助手" gravity="center" :fontSize="48" typeface="bold" />
      <qt-text class="home-subtitle" text="大屏应用安装专家" gravity="center" :fontSize="26" />
      
      <div class="home-menu">
        <div
          class="menu-item"
          :focusable="true"
          :focusScale="1.05"
          @click="goCode"
        >
          <qt-text text="🔑" gravity="center" :fontSize="56" />
          <qt-text class="menu-title" text="口令安装" gravity="center" :fontSize="32" typeface="bold" />
          <qt-text class="menu-desc" text="输入4位口令快速安装应用" gravity="center" :fontSize="22" />
        </div>
        
        <div
          class="menu-item"
          :focusable="true"
          :focusScale="1.05"
          @click="goSettings"
        >
          <qt-text text="⚙️" gravity="center" :fontSize="56" />
          <qt-text class="menu-title" text="设置" gravity="center" :fontSize="32" typeface="bold" />
          <qt-text class="menu-desc" text="服务器地址配置" gravity="center" :fontSize="22" />
        </div>
      </div>
      
      <qt-text class="home-version" :text="'版本 ' + version" gravity="center" :fontSize="20" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useESRouter } from '@extscreen/es3-router'

defineOptions({ name: 'yecao-home' })

const router = useESRouter()
const version = '1.0.0'

function goCode() {
  router.push({ path: '/yecao-code' })
}

function goSettings() {
  router.push({ path: '/yecao-settings' })
}

const onESCreate = () => {
  console.log('星河助手首页加载完成')
}

const onBackPressed = () => {
  return false
}

defineExpose({ onESCreate, onBackPressed })
</script>

<style lang="scss" scoped>
.home-root {
  width: 1920px;
  height: 1080px;
  background-color: #0f3460;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.home-container {
  flex-direction: column;
  align-items: center;
}

.home-logo {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.home-title {
  color: #ffffff;
  margin-bottom: 10px;
}

.home-subtitle {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 60px;
}

.home-menu {
  flex-direction: row;
  justify-content: center;
  margin-bottom: 60px;
}

.menu-item {
  width: 280px;
  height: 220px;
  margin: 0 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: transparent;
}

.menu-title {
  color: #ffffff;
  margin-top: 15px;
  margin-bottom: 8px;
}

.menu-desc {
  color: rgba(255, 255, 255, 0.6);
}

.home-version {
  color: rgba(255, 255, 255, 0.4);
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
}
</style>
