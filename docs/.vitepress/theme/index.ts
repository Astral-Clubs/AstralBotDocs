import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@fontsource-variable/onest'
import '@fontsource-variable/jetbrains-mono'
import './style.css'
import PageActions from './components/PageActions.vue'
import TgPreview from './components/TgPreview.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-footer-before': () => h(PageActions)
    })
  },
  enhanceApp({ app }) {
    app.component('TgPreview', TgPreview)
  }
} satisfies Theme
