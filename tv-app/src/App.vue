<template>
  <div class="app-root">
    <es-router-view></es-router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    function onESCreate() {
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
