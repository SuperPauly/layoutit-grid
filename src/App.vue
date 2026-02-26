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
}
</style>
