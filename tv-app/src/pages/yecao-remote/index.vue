<template>
  <div class="remote-root">
    <div class="remote-header">
      <div class="header-back" :focusable="true" :focusScale="1.05" @click="goBack">
        <qt-text text="← 返回" gravity="center" :fontSize="28" />
      </div>
      <qt-text class="header-title" text="远程推送" gravity="center" :fontSize="36" typeface="bold" />
      <div class="header-placeholder"></div>
    </div>

    <div class="remote-content">
      <qt-text class="remote-subtitle" text="通过电脑或手机推送应用到电视" gravity="center" :fontSize="26" />

      <div class="push-methods">
        <div class="push-card">
          <qt-text class="push-card-icon" text="💻" gravity="center" :fontSize="72" />
          <qt-text class="push-card-title" text="方式一：电脑安装" gravity="center" :fontSize="32" typeface="bold" />
          <qt-text class="push-card-desc" text="用电脑浏览器访问以下地址，即可安装应用" gravity="center" :fontSize="24" />
          <div class="push-url-box">
            <qt-text class="push-url" text="xinghe.tv/push" gravity="center" :fontSize="28" />
          </div>
          <qt-text class="push-tip" text="请确保电脑与电视连接在同一网络" gravity="center" :fontSize="22" />
        </div>

        <div class="push-card">
          <qt-text class="push-card-icon" text="📱" gravity="center" :fontSize="72" />
          <qt-text class="push-card-title" text="方式二：手机安装" gravity="center" :fontSize="32" typeface="bold" />
          <qt-text class="push-card-desc" text="用手机扫码，即可推送应用到电视" gravity="center" :fontSize="24" />
          <div class="qr-code-box">
            <qt-text text="🔲🔲🔲🔲🔲🔲🔲🔲" gravity="center" :fontSize="28" />
            <qt-text text="🔲🔳🔲🔳🔲🔳🔲🔳" gravity="center" :fontSize="28" />
            <qt-text text="🔲🔲🔲🔲🔲🔲🔲🔲" gravity="center" :fontSize="28" />
            <qt-text text="🔲🔳🔳🔲🔲🔳🔳🔲" gravity="center" :fontSize="28" />
            <qt-text text="🔲🔲🔲🔲🔲🔲🔲🔲" gravity="center" :fontSize="28" />
            <qt-text text="🔲🔳🔲🔲🔲🔳🔲🔲" gravity="center" :fontSize="28" />
            <qt-text text="🔲🔲🔲🔲🔲🔲🔲🔲" gravity="center" :fontSize="28" />
            <qt-text text="🔲🔲🔲🔲🔲🔲🔲🔲" gravity="center" :fontSize="28" />
          </div>
          <qt-text class="push-tip" text="扫码后选择应用即可远程安装" gravity="center" :fontSize="22" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useESRouter } from '@extscreen/es3-router'

defineOptions({ name: 'yecao-remote' })

const router = useESRouter()

function goBack() {
  router.back()
}

const onESCreate = () => {
  console.log('远程推送页面加载')
}

const onBackPressed = () => {
  router.back()
  return true
}

defineExpose({ onESCreate, onBackPressed })
</script>

<style lang="scss" scoped>
.remote-root {
  width: 1920px;
  height: 1080px;
  background-color: #0f3460;
  flex-direction: column;
}

.remote-header {
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

.header-placeholder {
  width: 120px;
}

.remote-content {
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
}

.remote-subtitle {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 50px;
}

.push-methods {
  flex-direction: row;
  gap: 50px;
}

.push-card {
  width: 550px;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.1);
}

.push-card-icon {
  margin-bottom: 25px;
}

.push-card-title {
  color: #ffffff;
  margin-bottom: 15px;
}

.push-card-desc {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 30px;
}

.push-url-box {
  width: 100%;
  height: 70px;
  background-color: rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  border-width: 2px;
  border-color: #667eea;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.push-url {
  color: #667eea;
}

.qr-code-box {
  width: 240px;
  height: 240px;
  background-color: #ffffff;
  border-radius: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  margin-bottom: 15px;
}

.push-tip {
  color: rgba(255, 255, 255, 0.5);
}
</style>
