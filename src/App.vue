<template>
  <LayoutEditor />
</template>

<script setup>
import { onMounted } from 'vue'
import { registerSW } from 'virtual:pwa-register'

import LayoutEditor from './components/LayoutEditor.vue'

onMounted(async () => {
  registerSW({ immediate: true })
})
</script>

<style lang="postcss"></style>
