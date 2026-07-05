<template>
  <div class="home-root">
    <div class="home-header">
      <div class="header-left">
        <qt-text text="✨" gravity="center" :fontSize="36" />
        <qt-text class="header-title" text="星河助手" gravity="center" :fontSize="32" typeface="bold" />
      </div>
      <div class="header-center">
        <div
          v-for="(item, index) in navItems"
          :key="index"
          class="nav-item"
          :class="{ active: activeNav === index }"
          :focusable="true"
          :focusScale="1.05"
          @click="onNavClick(index)"
        >
          <qt-text :text="item.name" gravity="center" :fontSize="26" />
        </div>
      </div>
      <div class="header-right">
        <div
          class="header-btn"
          :focusable="true"
          :focusScale="1.05"
          @click="goSettings"
        >
          <qt-text text="⚙️" gravity="center" :fontSize="28" />
        </div>
      </div>
    </div>

    <div class="home-content">
      <div v-if="activeNav === 0" class="section-container">
        <qt-text class="section-title" text="口令安装" gravity="center" :fontSize="40" typeface="bold" />
        <qt-text class="section-subtitle" text="输入4位分享口令，快速安装应用" gravity="center" :fontSize="26" />

        <div class="code-display">
          <div
            v-for="i in 4"
            :key="i"
            class="code-digit"
            :class="{ active: currentIndex === i - 1, filled: codeInput[i - 1] }"
          >
            <qt-text
              v-if="codeInput[i - 1]"
              :text="codeInput[i - 1]"
              gravity="center"
              :fontSize="56"
              typeface="bold"
            />
          </div>
        </div>

        <div v-if="errorMsg" class="code-error">
          <qt-text :text="errorMsg" gravity="center" :fontSize="24" />
        </div>

        <div v-if="loading" class="code-loading">
          <qt-text text="验证中..." gravity="center" :fontSize="26" />
        </div>

        <div class="keyboard">
          <div class="kb-row" v-for="(row, idx) in kbRows" :key="idx">
            <div
              v-for="(key, kidx) in row"
              :key="kidx"
              class="kb-key"
              :class="{ wide: key === 'del' || key === 'ok' }"
              :focusable="true"
              :focusScale="1.08"
              @click="onKey(key)"
            >
              <qt-text
                v-if="key === 'del'"
                text="⌫ 退格"
                gravity="center"
                :fontSize="26"
              />
              <qt-text
                v-else-if="key === 'ok'"
                text="确定 ✓"
                gravity="center"
                :fontSize="26"
                typeface="bold"
              />
              <qt-text
                v-else
                :text="key"
                gravity="center"
                :fontSize="32"
                typeface="bold"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeNav === 1" class="section-container">
        <qt-text class="section-title" text="远程推送" gravity="center" :fontSize="40" typeface="bold" />
        <qt-text class="section-subtitle" text="通过电脑或手机推送应用到电视" gravity="center" :fontSize="26" />

        <div class="push-methods">
          <div class="push-card">
            <qt-text class="push-card-icon" text="💻" gravity="center" :fontSize="60" />
            <qt-text class="push-card-title" text="方式一：电脑安装" gravity="center" :fontSize="28" typeface="bold" />
            <qt-text class="push-card-desc" text="用电脑浏览器访问以下地址，即可安装应用" gravity="center" :fontSize="22" />
            <div class="push-url-box">
              <qt-text class="push-url" text="xinghe.tv/push" gravity="center" :fontSize="24" />
            </div>
          </div>

          <div class="push-card">
            <qt-text class="push-card-icon" text="📱" gravity="center" :fontSize="60" />
            <qt-text class="push-card-title" text="方式二：手机安装" gravity="center" :fontSize="28" typeface="bold" />
            <qt-text class="push-card-desc" text="用手机扫码，即可推送应用到电视" gravity="center" :fontSize="22" />
            <div class="qr-code-box">
              <qt-text text="🔲🔲🔲🔲🔲🔲🔲🔲" gravity="center" :fontSize="24" />
              <qt-text text="🔲🔳🔲🔳🔲🔳🔲🔳" gravity="center" :fontSize="24" />
              <qt-text text="🔲🔲🔲🔲🔲🔲🔲🔲" gravity="center" :fontSize="24" />
              <qt-text text="🔲🔳🔳🔲🔲🔳🔳🔲" gravity="center" :fontSize="24" />
              <qt-text text="🔲🔲🔲🔲🔲🔲🔲🔲" gravity="center" :fontSize="24" />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeNav === 2" class="section-container">
        <qt-text class="section-title" text="应用管理" gravity="center" :fontSize="40" typeface="bold" />
        <qt-text class="section-subtitle" text="管理已安装的应用" gravity="center" :fontSize="26" />

        <div class="app-grid">
          <div
            v-for="(app, index) in mockApps"
            :key="index"
            class="app-item"
            :focusable="true"
            :focusScale="1.05"
          >
            <div class="app-icon">
              <qt-text :text="app.icon" gravity="center" :fontSize="48" />
            </div>
            <qt-text class="app-name" :text="app.name" gravity="center" :fontSize="24" />
          </div>
        </div>

        <div v-if="mockApps.length === 0" class="empty-state">
          <qt-text text="📦" gravity="center" :fontSize="60" />
          <qt-text class="empty-text" text="暂无已安装的应用" gravity="center" :fontSize="28" />
        </div>
      </div>

      <div v-else class="section-container">
        <qt-text class="section-title" :text="navItems[activeNav].name" gravity="center" :fontSize="40" typeface="bold" />
        <div class="empty-state">
          <qt-text text="🔜" gravity="center" :fontSize="60" />
          <qt-text class="empty-text" text="功能开发中，敬请期待" gravity="center" :fontSize="28" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import { getFileInfo } from '../../api/yecao'

defineOptions({ name: 'home' })

const router = useESRouter()

const navItems = [
  { name: '口令安装', path: '/yecao-code' },
  { name: '远程推送', path: '/yecao-remote' },
  { name: '应用管理', path: '/yecao-manager' },
  { name: 'U盘安装', path: '' },
  { name: '星河推荐', path: '' },
  { name: '装机必备', path: '' }
]

const activeNav = ref(0)

const codeInput = ref<string[]>(['', '', '', ''])
const currentIndex = ref(0)
const errorMsg = ref('')
const loading = ref(false)

const kbRows = [
  ['1', '2', '3', '4', '5', '6'],
  ['7', '8', '9', '0', 'A', 'B'],
  ['C', 'D', 'E', 'F', 'G', 'H'],
  ['I', 'J', 'K', 'L', 'M', 'N'],
  ['O', 'P', 'Q', 'R', 'S', 'T'],
  ['U', 'V', 'W', 'X', 'Y', 'Z'],
  ['del', 'ok']
]

const mockApps = [
  { name: '银河奇异果', icon: '🥝' },
  { name: 'CIBN酷喵', icon: '🐱' },
  { name: '腾讯视频', icon: '🐧' },
  { name: '芒果TV', icon: '🥭' },
  { name: '哔哩哔哩', icon: '📺' },
  { name: '西瓜视频', icon: '🍉' },
  { name: '抖音', icon: '🎵' },
  { name: '快手', icon: '⚡' },
  { name: '当贝市场', icon: '🛒' },
  { name: '文件管理器', icon: '📁' },
  { name: '浏览器', icon: '🌐' },
  { name: '设置', icon: '⚙️' }
]

const isComplete = computed(() => codeInput.value.every(c => c !== ''))

function onNavClick(index: number) {
  activeNav.value = index
  if (navItems[index].path) {
    router.push({ path: navItems[index].path })
  }
}

function onKey(key: string) {
  if (loading.value) return
  errorMsg.value = ''

  if (key === 'del') {
    if (currentIndex.value > 0) {
      currentIndex.value--
      codeInput.value[currentIndex.value] = ''
    } else if (codeInput.value[0]) {
      codeInput.value[0] = ''
    }
    return
  }

  if (key === 'ok') {
    if (isComplete.value) {
      verify()
    } else {
      errorMsg.value = '请输入完整的4位口令'
    }
    return
  }

  if (currentIndex.value < 4) {
    codeInput.value[currentIndex.value] = key
    currentIndex.value++
    if (currentIndex.value === 4) {
      setTimeout(verify, 300)
    }
  }
}

async function verify() {
  const code = codeInput.value.join('')
  loading.value = true
  errorMsg.value = ''

  try {
    const info = await getFileInfo(code)
    if (info) {
      router.push({
        path: '/yecao-download',
        query: { code, filename: info.filename, size: info.size }
      })
    } else {
      errorMsg.value = '口令无效或文件已过期'
      clearCode()
    }
  } catch (e) {
    errorMsg.value = '网络错误，请检查服务器地址'
    clearCode()
  } finally {
    loading.value = false
  }
}

function clearCode() {
  codeInput.value = ['', '', '', '']
  currentIndex.value = 0
}

function goSettings() {
  router.push({ path: '/yecao-settings' })
}

const onESCreate = () => {
  console.log('星河助手首页加载')
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
}

.home-header {
  height: 80px;
  background-color: rgba(0, 0, 0, 0.3);
  flex-direction: row;
  align-items: center;
  padding: 0 30px;
}

.header-left {
  width: 200px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.header-title {
  color: #ffffff;
}

.header-center {
  flex: 1;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
}

.nav-item {
  height: 48px;
  padding: 0 25px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  justify-content: center;
  align-items: center;

  &.active {
    background-color: rgba(102, 126, 234, 0.3);
    border-width: 2px;
    border-color: #667eea;
  }

  :deep(qt-text) {
    color: rgba(255, 255, 255, 0.7);
  }

  &.active :deep(qt-text) {
    color: #ffffff;
  }
}

.header-right {
  width: 100px;
  flex-direction: row;
  justify-content: flex-end;
}

.header-btn {
  width: 48px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  justify-content: center;
  align-items: center;
}

.home-content {
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
}

.section-container {
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.section-title {
  color: #ffffff;
  margin-bottom: 10px;
}

.section-subtitle {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 40px;
}

.code-display {
  flex-direction: row;
  justify-content: center;
  margin-bottom: 30px;
}

.code-digit {
  width: 100px;
  height: 120px;
  margin: 0 12px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  border-width: 3px;
  border-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;

  &.active {
    border-color: #667eea;
    background-color: rgba(102, 126, 234, 0.15);
  }

  &.filled {
    border-color: #667eea;
  }

  :deep(qt-text) {
    color: #ffffff;
  }
}

.code-error {
  margin-bottom: 20px;
  padding: 12px 28px;
  background-color: rgba(239, 68, 68, 0.15);
  border-radius: 8px;

  :deep(qt-text) {
    color: #f87171;
  }
}

.code-loading {
  margin-bottom: 20px;

  :deep(qt-text) {
    color: #667eea;
  }
}

.keyboard {
  flex-direction: column;
  align-items: center;
}

.kb-row {
  flex-direction: row;
  justify-content: center;
  margin-bottom: 8px;
}

.kb-key {
  width: 85px;
  height: 65px;
  margin: 0 5px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: transparent;

  &.wide {
    width: 135px;
  }

  :deep(qt-text) {
    color: #ffffff;
  }
}

.push-methods {
  flex-direction: row;
  gap: 40px;
}

.push-card {
  width: 500px;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
}

.push-card-icon {
  margin-bottom: 20px;
}

.push-card-title {
  color: #ffffff;
  margin-bottom: 12px;
}

.push-card-desc {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 25px;
}

.push-url-box {
  width: 100%;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  justify-content: center;
  align-items: center;
}

.push-url {
  color: #667eea;
}

.qr-code-box {
  width: 200px;
  height: 200px;
  background-color: #ffffff;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(6, 280px);
  gap: 30px;
  padding: 0 40px;
}

.app-item {
  flex-direction: column;
  align-items: center;
  padding: 25px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
}

.app-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  justify-content: center;
  align-items: center;
}

.app-name {
  color: rgba(255, 255, 255, 0.8);
  max-width: 250px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.empty-state {
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
}

.empty-text {
  color: rgba(255, 255, 255, 0.5);
  margin-top: 20px;
}
</style>
