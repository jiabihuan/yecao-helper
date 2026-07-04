<template>
  <div class='app-root-css' :gradientBackground="{colors:bgGradientColor,orientation: 4}">
    <es-router-view></es-router-view>
  </div>
</template>

<script lang='ts'>
import { useESRouter } from '@extscreen/es3-router'
import { defineComponent } from 'vue'
import { Native } from '@extscreen/es3-vue'
import {
  ESLogLevel,
  useES,
  useESDevelop,
  useESDevice,
  useESLocalStorage,
  useESLog,
  useESNetwork,
  useESRuntime
} from '@extscreen/es3-core'
import { ESPlayerLogLevel, useESPlayerLog, useESPlayer} from '@extscreen/es3-player'
import requestManager from './tools/request'

import BuildConfig from './config/build-config'
import ThemeConfig from './config/theme-config'

export default defineComponent({
  name: 'App',
  emits: [],
  setup() {
    const bgGradientColor = ThemeConfig.bgGradientColor

    const router = useESRouter()
    const network = useESNetwork()
    const localStore = useESLocalStorage()
    const log = useESLog()
    const playerLog = useESPlayerLog()

    const es = useES()
    const develop = useESDevelop()
    const device = useESDevice()
    const runtime = useESRuntime()
    const playerManager = useESPlayer()

    function onESCreate() {
      network.addListener(connectivityChangeListener)
      initESLog()
      initTheme()
      return Promise.resolve()
        .then(() => requestManager.init(es, develop, device, runtime, log))
        .then(() => {
           playerManager.init({
            debug: BuildConfig.DEBUG,
            display: {
              screenWidth: device.getScreenWidth(),
              screenHeight: device.getScreenHeight()
            },
            device: {
              deviceType: runtime.getRuntimeDeviceType() ?? ''
            }
          })
        })
    }

    function initTheme() {
      Native.callNative('FastListModule', 'setFadeEnabled', true)
      Native.callNative('FastListModule', 'setFadeDuration', 500)
      if (ThemeConfig.focusBorderCornerEnable) {
        Native.callNative('FocusModule', 'setDefaultFocusBorderCorner', ThemeConfig.focusBorderCorner)
      }
      if (ThemeConfig.focusBorderColorEnable) {
        Native.callNative('FocusModule', 'setDefaultFocusBorderColor', ThemeConfig.focusBorderColor)
      }
      if (ThemeConfig.focusBorderWidthEnable) {
        Native.callNative('FocusModule', 'setDefaultFocusBorderWidth', ThemeConfig.focusBorderWidth)
      }
      if (ThemeConfig.focusBorderInsetEnable) {
        Native.callNative('FocusModule', 'setFocusBorderInsetValue', ThemeConfig.focusBorderInsetValue)
      }
      Native.callNative('FocusModule', 'setDefaultFocusInnerBorderEnable', ThemeConfig.focusInnerBorderEnable)
      Native.callNative('FocusModule', 'setDefaultPlaceholderFocusScale', ThemeConfig.placeHolderFocusScale);
    }

    function initESLog() {
      if (BuildConfig.DEBUG) {
        log.setMinimumLoggingLevel(ESLogLevel.DEBUG)
        playerLog.setMinimumLoggingLevel(ESPlayerLogLevel.DEBUG)
      } else {
        log.setMinimumLoggingLevel(ESLogLevel.WARN)
        playerLog.setMinimumLoggingLevel(ESPlayerLogLevel.WARN)
      }
    }

    const connectivityChangeListener = {
      onConnectivityChange() {
        const isNetworkConnected = network.isNetworkConnected()
        if (!isNetworkConnected) {
         console.log('网络已断开')
        }
      }
    }

    function onESDestroy() {
      network.removeListener(connectivityChangeListener)
    }

    return {
      bgGradientColor,
      onESCreate,
      onESDestroy
    }
  }
})
</script>

<style src='./app.scss'>
</style>
