<template>
  <div class="home-root">
    <div class="home-content">
      <div class="home-logo">
        <qt-text text="✨" gravity="center" :fontSize="72" />
      </div>
      <qt-text class="home-title" text="星河助手" gravity="center" :fontSize="44" typeface="bold" />
      <qt-text class="home-subtitle" text="输入4位口令，快速安装应用" gravity="center" :fontSize="24" />

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
            :fontSize="52"
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

      <div class="home-footer">
        <div
          class="setting-btn"
          :focusable="true"
          :focusScale="1.05"
          @click="goSettings"
        >
          <qt-text text="⚙️ 设置" gravity="center" :fontSize="24" />
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

const isComplete = computed(() => codeInput.value.every(c => c !== ''))

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
  align-items: center;
  justify-content: center;
}

.home-content {
  flex-direction: column;
  align-items: center;
}

.home-logo {
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
}

.home-title {
  color: #ffffff;
  margin-bottom: 8px;
}

.home-subtitle {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 35px;
}

.code-display {
  flex-direction: row;
  justify-content: center;
  margin-bottom: 25px;
}

.code-digit {
  width: 90px;
  height: 110px;
  margin: 0 10px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 14px;
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
  padding: 10px 24px;
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
  width: 80px;
  height: 60px;
  margin: 0 5px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: transparent;

  &.wide {
    width: 125px;
  }

  :deep(qt-text) {
    color: #ffffff;
  }
}

.home-footer {
  margin-top: 30px;
}

.setting-btn {
  width: 160px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  justify-content: center;
  align-items: center;

  :deep(qt-text) {
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>
