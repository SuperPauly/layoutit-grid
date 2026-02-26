<template>
  <div class="layout-editor-controls" data-testid="controls-panel">
    <AreaProps :area="currentArea" />
  </div>
</template>

<script setup lang="ts">
import { useAppState } from '../store.js'

let { currentArea } = $(useAppState())
</script>

<style scoped lang="postcss">
.layout-editor-controls {
  overflow: auto;
  color: var(--color-white);
  background: var(--color-gray-darkest);
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
