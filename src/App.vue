<template>
  <LayoutEditor v-if="!showEmbeddableViews" />
  <div v-else class="embeddable-demo">
    <LayoutEditorControlsView />
    <LayoutEditorWorkspaceView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { registerSW } from 'virtual:pwa-register'

import LayoutEditor from './components/LayoutEditor.vue'
import LayoutEditorControlsView from './components/LayoutEditorControlsView.vue'
import LayoutEditorWorkspaceView from './components/LayoutEditorWorkspaceView.vue'

const showEmbeddableViews = new URLSearchParams(window.location.search).get('embeddable') === '1'

onMounted(async () => {
  registerSW({ immediate: true })
})
</script>

<style lang="postcss">
.embeddable-demo {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
  overflow: hidden;
}

@media (max-width: 768px) {
  .embeddable-demo {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    position: relative;
  }

  .embeddable-demo [data-testid='workspace'] {
    grid-column: 1;
    grid-row: 1;
    min-height: 0;
    width: 100%;
  }

  .embeddable-demo [data-testid='controls-panel'] {
    grid-column: 1;
    grid-row: 1;
    align-self: end;
    justify-self: stretch;
    z-index: 2;
    max-height: min(55vh, 420px);
    margin: 0.75rem;
    border-radius: 0.75rem;
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.3);
  }
}
</style>
