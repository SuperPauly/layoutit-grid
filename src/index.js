import GridEditor from './components/grid/GridEditor.vue'
import FlexEditor from './components/flex/FlexEditor.vue'

// Embeddable layout editor components for use in a host application.
// These components share a singleton store and can be mounted independently.
export { default as LayoutEditor } from './components/LayoutEditor.vue'
export { default as LayoutEditorWorkspaceView } from './components/LayoutEditorWorkspaceView.vue'
export { default as LayoutEditorControlsView } from './components/LayoutEditorControlsView.vue'

// Host apps should call this once on their Vue app instance before mounting.
/**
 * @param {import('vue').App} app
 * @returns {void}
 */
export function registerLayoutEditorGlobals(app) {
  app.component('GridEditor', GridEditor)
  app.component('FlexEditor', FlexEditor)
}
