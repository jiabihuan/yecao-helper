<template>
  <div class="code-root">
    <div class="code-container">
      <qt-text class="code-title" text="口令安装" gravity="center" :fontSize="40" typeface="bold" />
      <qt-text class="code-subtitle" text="请输入4位分享口令" gravity="center" :fontSize="26" />

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

      <div class="code-keyboard">
        <div class="keyboard-row" v-for="(row, rowIndex) in keyboardRows" :key="rowIndex">
          <div
            v-for="(key, keyIndex) in row"
            :key="keyIndex"
            class="keyboard-key"
            :class="{ wide: key === 'del' || key === 'ok' }"
            :focusable="true"
            :focusScale="1.08"
            @click="onKeyClick(key)"
          >
            <qt-text
              v-if="key === 'del'"
              text="⌫ 退格"
              gravity="center"
              :fontSize="28"
            />
            <qt-text
              v-else-if="key === 'ok'"
              text="确定 ✓"
              gravity="center"
              :fontSize="28"
              typeface="bold"
            />
            <qt-text
              v-else
              :text="key"
              gravity="center"
              :fontSize="36"
              typeface="bold"
            />
          </div>
        </div>
      </div>

      <div v-if="errorMsg" class="code-error">
        <qt-text :text="errorMsg" gravity="center" :fontSize="26" />
      </div>

      <div v-if="loading" class="code-loading">
        <qt-text text="验证中..." gravity="center" :fontSize="28" />
      </div>
      
      <div class="code-back">
        <div
          class="back-btn"
          :focusable="true"
          :focusScale="1.05"
          @click="goBack"
        >
          <qt-text text="← 返回首页" gravity="center" :fontSize="26" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import { getFileInfo } from '../../api/yecao'

defineOptions({ name: 'yecao-code' })

const router = useESRouter()

const codeInput = ref<string[]>(['', '', '', ''])
const currentIndex = ref(0)
const errorMsg = ref('')
const loading = ref(false)

const keyboardRows = [
  ['1', '2', '3', '4', '5', '6'],
  ['7', '8', '9', '0', 'A', 'B'],
  ['C', 'D', 'E', 'F', 'G', 'H'],
  ['I', 'J', 'K', 'L', 'M', 'N'],
  ['O', 'P', 'Q', 'R', 'S', 'T'],
  ['U', 'V', 'W', 'X', 'Y', 'Z'],
  ['del', 'ok']
]

const isComplete = computed(() => {
  return codeInput.value.every(c => c !== '')
})

function onKeyClick(key: string) {
  if (loading.value) return
  
  errorMsg.value = ''
  
  if (key === 'del') {
    if (currentIndex.value > 0) {
      currentIndex.value--
      codeInput.value[currentIndex.value] = ''
    } else if (codeInput.value[0] !== '') {
      codeInput.value[0] = ''
    }
    return
  }
  
  if (key === 'ok') {
    if (isComplete.value) {
      verifyCode()
    } else {
      errorMsg.value = '请输入完整的4位口令'
    }
    return
  }
  
  if (currentIndex.value < 4) {
    codeInput.value[currentIndex.value] = key
    currentIndex.value++
    
    if (currentIndex.value === 4) {
      setTimeout(() => {
        verifyCode()
      }, 300)
    }
  }
}

async function verifyCode() {
  const code = codeInput.value.join('')
  loading.value = true
  errorMsg.value = ''
  
  try {
    const fileInfo = await getFileInfo(code)
    if (fileInfo) {
      router.push({
        path: '/yecao-download',
        query: { code, filename: fileInfo.filename, size: fileInfo.size }
      })
    } else {
      errorMsg.value = '口令无效或文件已过期'
      clearInput()
    }
  } catch (e) {
    errorMsg.value = '网络错误，请检查服务器地址'
    clearInput()
  } finally {
    loading.value = false
  }
}

function clearInput() {
  codeInput.value = ['', '', '', '']
  currentIndex.value = 0
}

function goBack() {
  router.back()
}

const onESCreate = () => {
  console.log('口令输入页加载完成')
}

const onBackPressed = () => {
  router.back()
  return true
}

defineExpose({ onESCreate, onBackPressed })
</script>

<style lang="scss" scoped>
.code-root {
  width: 1920px;
  height: 1080px;
  background-color: #0f3460;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
}

.code-container {
  flex-direction: column;
  align-items: center;
}

.code-title {
  color: #ffffff;
  margin-bottom: 10px;
}

.code-subtitle {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
}

.code-display {
  flex-direction: row;
  justify-content: center;
  margin-bottom: 50px;
}

.code-digit {
  width: 100px;
  height: 120px;
  margin: 0 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  border-width: 3px;
  border-color: rgba(255, 255, 255, 0.3);
  justify-content: center;
  align-items: center;
  
  &.active {
    border-color: #667eea;
    background-color: rgba(102, 126, 234, 0.2);
  }
  
  &.filled {
    border-color: #667eea;
    background-color: rgba(102, 126, 234, 0.15);
  }
  
  :deep(qt-text) {
    color: #ffffff;
  }
}

.code-keyboard {
  flex-direction: column;
  align-items: center;
}

.keyboard-row {
  flex-direction: row;
  justify-content: center;
  margin-bottom: 10px;
}

.keyboard-key {
  width: 90px;
  height: 70px;
  margin: 0 6px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: transparent;
  
  &.wide {
    width: 140px;
  }
  
  :deep(qt-text) {
    color: #ffffff;
  }
}

.code-error {
  margin-top: 30px;
  padding: 15px 30px;
  background-color: rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  
  :deep(qt-text) {
    color: #f87171;
  }
}

.code-loading {
  margin-top: 30px;
  
  :deep(qt-text) {
    color: #667eea;
  }
}

.code-back {
  margin-top: 40px;
}

.back-btn {
  width: 200px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  
  :deep(qt-text) {
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>
