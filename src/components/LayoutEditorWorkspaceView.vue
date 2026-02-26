<template>
  <div class="layout-editor-workspace layout-editor-theme" data-testid="workspace">
    <AreaEditor :area="mainArea" />
  </div>
</template>

<script setup lang="ts">
import '../styles/layout-editor-shared.css'
import { loadFromStorage, useAppState } from '../store.js'
import { keyMonitor } from '../utils/keyMonitor'

let { mainArea } = $(useAppState())

onMounted(() => {
  loadFromStorage()
  addEventListener('keydown', keyMonitor)
})

onUnmounted(() => removeEventListener('keydown', keyMonitor))
</script>

<style scoped lang="postcss">
.layout-editor-workspace {
  flex: 1;
  display: grid;
  overflow: auto;
  align-items: center;
  justify-items: center;
  min-width: 0;
  min-height: 200px;
  width: 100%;
  height: 100%;
}
</style>
