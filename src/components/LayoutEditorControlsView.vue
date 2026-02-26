<template>
  <div class="layout-editor-controls layout-editor-theme" data-testid="controls-panel">
    <h2 class="layout-editor-title" data-testid="layout-editor-title">Layout Editor</h2>
    <AreaProps :area="currentArea" />
  </div>
</template>

<script setup lang="ts">
import '../styles/layout-editor-shared.css'
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

.layout-editor-title {
  margin: 0;
  padding: 12px 16px;
  color: var(--color-gray-lightest);
  background: var(--color-gray-dark);
  border-bottom: 1px solid var(--color-gray-middle);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
