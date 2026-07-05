<template>
  <div class="app-root">
    <es-router-view></es-router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import { useESNetwork, useESLocalStorage, useESLog, ESLogLevel } from '@extscreen/es3-core'

export default defineComponent({
  name: 'App',
  setup() {
    const router = useESRouter()
    const network = useESNetwork()
    const localStorage = useESLocalStorage()
    const log = useESLog()

    function onESCreate() {
      log.setMinimumLoggingLevel(ESLogLevel.DEBUG)
      console.log('星河助手启动')
      return Promise.resolve()
    }

    function onESDestroy() {}

    return {
      onESCreate,
      onESDestroy
    }
  }
})
</script>

<style>
.app-root {
  width: 1920px;
  height: 1080px;
  background-color: #0f3460;
}
</style>
