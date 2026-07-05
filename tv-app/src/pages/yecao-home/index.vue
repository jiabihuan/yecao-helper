<template>
  <div class="yecao-home-root" :gradientBackground="{ colors: bgColors, orientation: 0 }">
    <div class="yecao-home-header">
      <qt-text class="yecao-home-logo" text="🌿" gravity="center" :fontSize="80" />
      <qt-text class="yecao-home-title" text="星河助手" gravity="center" :fontSize="48" typeface="bold" />
      <qt-text class="yecao-home-subtitle" text="大屏应用安装专家" gravity="center" :fontSize="28" />
    </div>

    <div class="yecao-home-menu">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="yecao-menu-item"
        :focusable="true"
        :focusScale="1.05"
        @click="onMenuClick(item)"
        :nextFocusUp="index < 2 ? '' : ''"
      >
        <qt-text class="yecao-menu-icon" :text="item.icon" gravity="center" :fontSize="56" />
        <qt-text class="yecao-menu-title" :text="item.title" gravity="center" :fontSize="32" typeface="bold" />
        <qt-text class="yecao-menu-desc" :text="item.desc" gravity="center" :fontSize="24" />
      </div>
    </div>

    <div class="yecao-home-footer">
      <qt-text class="yecao-home-version" :text="'版本 ' + version" gravity="center" :fontSize="22" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import ThemeConfig from '../../config/theme-config'

defineOptions({ name: 'yecao-home' })

const router = useESRouter()
const version = '1.0.0'

const bgColors = ['#1a1a2e', '#16213e', '#0f3460']

const menuItems = ref([
  {
    id: 'code',
    icon: '🔑',
    title: '口令安装',
    desc: '输入4位口令快速安装应用',
    path: '/yecao-code'
  },
  {
    id: 'usb',
    icon: '💾',
    title: 'U盘安装',
    desc: '通过U盘安装本地APK',
    path: '/yecao-usb'
  },
  {
    id: 'manager',
    icon: '📱',
    title: '应用管理',
    desc: '查看和管理已安装应用',
    path: '/yecao-manager'
  },
  {
    id: 'settings',
    icon: '⚙️',
    title: '设置',
    desc: '服务器地址等配置',
    path: '/yecao-settings'
  }
])

function onMenuClick(item: any) {
  if (item.path) {
    router.push({ path: item.path })
  }
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
.yecao-home-root {
  width: 1920px;
  height: 1080px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.yecao-home-header {
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
}

.yecao-home-logo {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.yecao-home-title {
  color: #ffffff;
  margin-bottom: 10px;
}

.yecao-home-subtitle {
  color: rgba(255, 255, 255, 0.7);
}

.yecao-home-menu {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 1200px;
}

.yecao-menu-item {
  width: 280px;
  height: 220px;
  margin: 15px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: transparent;
}

.yecao-menu-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
}

.yecao-menu-title {
  color: #ffffff;
  margin-bottom: 8px;
}

.yecao-menu-desc {
  color: rgba(255, 255, 255, 0.6);
}

.yecao-home-footer {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
}

.yecao-home-version {
  color: rgba(255, 255, 255, 0.4);
}
</style>
