<template>
  <div class="manager-root">
    <div class="manager-header">
      <div class="header-back" :focusable="true" :focusScale="1.05" @click="goBack">
        <qt-text text="← 返回" gravity="center" :fontSize="28" />
      </div>
      <qt-text class="header-title" text="应用管理" gravity="center" :fontSize="36" typeface="bold" />
      <div class="header-action">
        <div class="action-btn" :focusable="true" :focusScale="1.05" @click="refreshApps">
          <qt-text text="🔄 刷新" gravity="center" :fontSize="24" />
        </div>
      </div>
    </div>

    <div class="manager-content">
      <div class="app-stats">
        <div class="stat-item">
          <qt-text class="stat-value" :text="apps.length" gravity="center" :fontSize="48" typeface="bold" />
          <qt-text class="stat-label" text="已安装应用" gravity="center" :fontSize="24" />
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <qt-text class="stat-value" text="64GB" gravity="center" :fontSize="48" typeface="bold" />
          <qt-text class="stat-label" text="已用空间" gravity="center" :fontSize="24" />
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <qt-text class="stat-value" text="128GB" gravity="center" :fontSize="48" typeface="bold" />
          <qt-text class="stat-label" text="总空间" gravity="center" :fontSize="24" />
        </div>
      </div>

      <div class="app-grid">
        <div
          v-for="(app, index) in apps"
          :key="index"
          class="app-item"
          :class="{ focused: focusedIndex === index }"
          :focusable="true"
          :focusScale="1.05"
          @click="onAppClick(app)"
        >
          <div class="app-icon">
            <qt-text :text="app.icon" gravity="center" :fontSize="56" />
          </div>
          <qt-text class="app-name" :text="app.name" gravity="center" :fontSize="26" />
          <qt-text class="app-size" :text="app.size" gravity="center" :fontSize="20" />
        </div>
      </div>

      <div v-if="apps.length === 0" class="empty-state">
        <qt-text text="📦" gravity="center" :fontSize="80" />
        <qt-text class="empty-text" text="暂无已安装的应用" gravity="center" :fontSize="32" />
      </div>
    </div>

    <div v-if="showAppMenu" class="app-menu-overlay" @click="closeAppMenu">
      <div class="app-menu" @click.stop>
        <qt-text class="menu-app-name" :text="selectedApp?.name" gravity="center" :fontSize="32" typeface="bold" />
        <div class="menu-item" :focusable="true" :focusScale="1.05" @click="openApp">
          <qt-text text="📱 打开应用" gravity="center" :fontSize="28" />
        </div>
        <div class="menu-item" :focusable="true" :focusScale="1.05" @click="uninstallApp">
          <qt-text text="🗑️ 卸载应用" gravity="center" :fontSize="28" />
        </div>
        <div class="menu-item menu-item-cancel" :focusable="true" :focusScale="1.05" @click="closeAppMenu">
          <qt-text text="取消" gravity="center" :fontSize="28" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useESRouter } from '@extscreen/es3-router'

defineOptions({ name: 'yecao-manager' })

const router = useESRouter()

interface AppInfo {
  name: string
  icon: string
  size: string
}

const apps = ref<AppInfo[]>([
  { name: '银河奇异果', icon: '🥝', size: '45.2MB' },
  { name: 'CIBN酷喵', icon: '🐱', size: '52.8MB' },
  { name: '腾讯视频', icon: '🐧', size: '61.5MB' },
  { name: '芒果TV', icon: '🥭', size: '38.9MB' },
  { name: '哔哩哔哩', icon: '📺', size: '58.3MB' },
  { name: '西瓜视频', icon: '🍉', size: '42.1MB' },
  { name: '抖音', icon: '🎵', size: '78.6MB' },
  { name: '快手', icon: '⚡', size: '65.4MB' },
  { name: '当贝市场', icon: '🛒', size: '35.7MB' },
  { name: '文件管理器', icon: '📁', size: '12.3MB' },
  { name: '浏览器', icon: '🌐', size: '28.9MB' },
  { name: '设置', icon: '⚙️', size: '8.5MB' }
])

const focusedIndex = ref(0)
const showAppMenu = ref(false)
const selectedApp = ref<AppInfo | null>(null)

function goBack() {
  router.back()
}

function refreshApps() {
  console.log('刷新应用列表')
}

function onAppClick(app: AppInfo) {
  selectedApp.value = app
  showAppMenu.value = true
}

function openApp() {
  console.log('打开应用:', selectedApp.value?.name)
  closeAppMenu()
}

function uninstallApp() {
  console.log('卸载应用:', selectedApp.value?.name)
  closeAppMenu()
}

function closeAppMenu() {
  showAppMenu.value = false
  selectedApp.value = null
}

const onESCreate = () => {
  console.log('应用管理页面加载')
}

const onBackPressed = () => {
  if (showAppMenu.value) {
    closeAppMenu()
    return true
  }
  router.back()
  return true
}

defineExpose({ onESCreate, onBackPressed })
</script>

<style lang="scss" scoped>
.manager-root {
  width: 1920px;
  height: 1080px;
  background-color: #0f3460;
  flex-direction: column;
}

.manager-header {
  height: 80px;
  background-color: rgba(0, 0, 0, 0.3);
  flex-direction: row;
  align-items: center;
  padding: 0 30px;
}

.header-back {
  width: 120px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  justify-content: center;
  align-items: center;

  :deep(qt-text) {
    color: rgba(255, 255, 255, 0.8);
  }
}

.header-title {
  flex: 1;
  color: #ffffff;
}

.header-action {
  width: 120px;
  flex-direction: row;
  justify-content: flex-end;
}

.action-btn {
  height: 48px;
  padding: 0 20px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  justify-content: center;
  align-items: center;

  :deep(qt-text) {
    color: rgba(255, 255, 255, 0.7);
  }
}

.manager-content {
  flex: 1;
  flex-direction: column;
  padding: 40px;
}

.app-stats {
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  margin-bottom: 40px;
}

.stat-item {
  flex-direction: column;
  align-items: center;
  padding: 0 60px;
}

.stat-value {
  color: #667eea;
  margin-bottom: 10px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.6);
}

.stat-divider {
  width: 2px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.1);
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(6, 280px);
  gap: 30px;
  flex: 1;
}

.app-item {
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border-width: 2px;
  border-color: transparent;

  &.focused {
    border-color: #667eea;
    background-color: rgba(102, 126, 234, 0.1);
  }
}

.app-icon {
  width: 90px;
  height: 90px;
  margin-bottom: 18px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  justify-content: center;
  align-items: center;
}

.app-name {
  color: #ffffff;
  margin-bottom: 8px;
  max-width: 240px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.app-size {
  color: rgba(255, 255, 255, 0.5);
}

.empty-state {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.empty-text {
  color: rgba(255, 255, 255, 0.5);
  margin-top: 25px;
}

.app-menu-overlay {
  position: absolute;
  width: 1920px;
  height: 1080px;
  background-color: rgba(0, 0, 0, 0.6);
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.app-menu {
  width: 400px;
  flex-direction: column;
  background-color: rgba(15, 52, 96, 0.95);
  border-radius: 20px;
  padding: 30px;
  border-width: 2px;
  border-color: #667eea;
}

.menu-app-name {
  color: #ffffff;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom-width: 2px;
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.menu-item {
  height: 65px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;

  :deep(qt-text) {
    color: rgba(255, 255, 255, 0.8);
  }
}

.menu-item-cancel {
  background-color: rgba(239, 68, 68, 0.2);

  :deep(qt-text) {
    color: #f87171;
  }
}
</style>
