<template>
  <vue-resizable :min-width="minWidth" :max-width="maxWidth" :width="width" :active="['r']">
    <div :class="['sidebar', { active: currentView === 'props' }]" data-testid="controls-sidebar">
      <h2 class="layout-editor-title" data-testid="layout-editor-title">Layout Editor</h2>
      <AreaProps :area="currentArea" />
    </div>
  </vue-resizable>
</template>

<script setup lang="ts">
import VueResizable from 'vue-resizable'
import { useAppState } from '../../store.js'
import { debounce } from '../../utils'

let { currentArea, currentView } = $(useAppState())

let maxWidth = ref(0)
let minWidth = ref(0)
let width = ref(0)
const onResize = debounce(handleResize)

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

function handleResize() {
  if (window.innerWidth < 768) {
    maxWidth.value = 0
    minWidth.value = 0
    width.value = 0
  } else {
    maxWidth.value = 320
    minWidth.value = 240
    width.value = 275
  }
}

handleResize()

defineProps<{ area }>()
</script>

<style scoped lang="postcss">
.sidebar {
  z-index: 20000;
  color: var(--color-white);
  overflow: auto;
  padding: 0;
  text-align: left;
  transition: transform 0.2s ease-in;
  user-select: none;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 768px) {
    transform: translateX(-100%);
    position: fixed;
    bottom: 0;
    top: 0;
    width: 85%;
    max-width: 320px;
    background: var(--color-gray-darkest);
    &.active {
      transform: translateX(0);
    }
  }
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

@media screen and (max-width: 768px) {
  .btn-undo,
  .btn-redo,
  .btn-github {
    display: none;
  }
}
</style>
