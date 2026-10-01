<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import {
  mdiCheck,
  mdiChevronDown,
  mdiContentCopy,
  mdiFileDownloadOutline,
  mdiLanguageMarkdownOutline,
  mdiOpenInNew
} from '@mdi/js'
import { claudeIcon, geminiIcon, openAiIcon } from '../brand-icons'

type MenuItem = {
  key: string
  title: string
  description: string
  icon: string
  run: () => void
}

const { page } = useData()
const route = useRoute()

const open = ref(false)
const copied = ref(false)
const toast = ref('')
const root = ref<HTMLElement | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const markdownPath = computed(() => {
  const relative = page.value.relativePath
  const path = relative.endsWith('/index.md') ? `${relative.slice(0, -'/index.md'.length)}.md` : relative
  return withBase(`/${path}`)
})

const fileName = computed(() => markdownPath.value.split('/').pop() || 'page.md')

function absoluteMarkdownUrl() {
  return new URL(markdownPath.value, window.location.origin).href
}

function aiPrompt() {
  return [
    `Прочитай страницу документации Telegram-бота Astral Moderation: ${absoluteMarkdownUrl()}`,
    'Я хочу задать по ней вопросы. Я не программист, поэтому объясняй простыми словами и показывай готовые примеры шаблонов, которые можно скопировать.'
  ].join('\n\n')
}

function showToast(message: string) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 4000)
}

async function fetchMarkdown() {
  const response = await fetch(markdownPath.value)
  if (!response.ok) throw new Error(String(response.status))
  return response.text()
}

async function copyPage() {
  try {
    await navigator.clipboard.writeText(await fetchMarkdown())
    copied.value = true
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => (copied.value = false), 2000)
  } catch {
    showToast('Не получилось скопировать страницу. Откройте ее как Markdown и скопируйте вручную.')
  }
}

async function downloadPage() {
  try {
    const blob = new Blob([await fetchMarkdown()], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName.value
    link.click()
    URL.revokeObjectURL(url)
  } catch {
    showToast('Не получилось скачать страницу. Попробуйте еще раз.')
  }
}

function openTab(url: string) {
  window.open(url, '_blank', 'noopener')
}

async function openInGemini() {
  const prompt = aiPrompt()
  try {
    await navigator.clipboard.writeText(prompt)
    showToast('Запрос скопирован. Вставьте его в поле Gemini: Ctrl+V (на Mac — Cmd+V).')
  } catch {
    showToast('Gemini откроется в новой вкладке. Попросите его прочитать ссылку на эту страницу.')
  }
  openTab(`https://gemini.google.com/app?q=${encodeURIComponent(prompt)}`)
}

const items: MenuItem[] = [
  {
    key: 'markdown',
    title: 'Открыть как Markdown',
    description: 'Исходный текст этой страницы',
    icon: mdiLanguageMarkdownOutline,
    run: () => openTab(markdownPath.value)
  },
  {
    key: 'chatgpt',
    title: 'Открыть в ChatGPT',
    description: 'Задать вопросы о странице',
    icon: openAiIcon,
    run: () => openTab(`https://chatgpt.com/?hints=search&prompt=${encodeURIComponent(aiPrompt())}`)
  },
  {
    key: 'claude',
    title: 'Открыть в Claude',
    description: 'Задать вопросы о странице',
    icon: claudeIcon,
    run: () => openTab(`https://claude.ai/new?q=${encodeURIComponent(aiPrompt())}`)
  },
  {
    key: 'gemini',
    title: 'Открыть в Gemini',
    description: 'Запрос скопируется — вставьте его',
    icon: geminiIcon,
    run: openInGemini
  }
]

function select(item: MenuItem) {
  open.value = false
  item.run()
}

function onDocumentClick(event: MouseEvent) {
  if (open.value && root.value && !root.value.contains(event.target as Node)) open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

watch(() => route.path, () => (open.value = false))

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
  clearTimeout(toastTimer)
  clearTimeout(copiedTimer)
})
</script>

<template>
  <div v-if="page.relativePath" ref="root" class="page-actions">
    <button class="pa-hint" type="button" @click.stop="open = !open">
      Остались вопросы? Спросите ИИ — он прочитает эту страницу
    </button>

    <div class="pa-controls">
      <div class="pa-split">
        <button class="pa-main" type="button" @click="copyPage">
          <svg class="pa-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="copied ? mdiCheck : mdiContentCopy" />
          </svg>
          {{ copied ? 'Скопировано' : 'Скопировать страницу' }}
        </button>
        <span class="pa-divider" aria-hidden="true" />
        <button
          class="pa-chevron"
          type="button"
          aria-haspopup="menu"
          :aria-expanded="open"
          aria-label="Другие действия со страницей"
          @click.stop="open = !open"
        >
          <svg class="pa-icon" :class="{ 'is-open': open }" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="mdiChevronDown" />
          </svg>
        </button>

        <Transition name="pa-menu">
          <div v-if="open" class="pa-menu" role="menu">
            <button
              v-for="item in items"
              :key="item.key"
              class="pa-item"
              type="button"
              role="menuitem"
              @click="select(item)"
            >
              <span class="pa-item-icon" :class="`is-${item.key}`">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="item.icon" /></svg>
              </span>
              <span class="pa-item-text">
                <span class="pa-item-title">
                  {{ item.title }}
                  <svg class="pa-external" viewBox="0 0 24 24" aria-hidden="true"><path :d="mdiOpenInNew" /></svg>
                </span>
                <span class="pa-item-description">{{ item.description }}</span>
              </span>
            </button>
          </div>
        </Transition>
      </div>

      <button class="pa-download" type="button" title="Скачать страницу (.md)" aria-label="Скачать страницу в формате Markdown" @click="downloadPage">
        <svg class="pa-icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="mdiFileDownloadOutline" /></svg>
      </button>
    </div>

    <Transition name="pa-toast">
      <div v-if="toast" class="pa-toast" role="status">{{ toast }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.page-actions {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 48px;
  padding: 16px 20px;
  border-radius: 12px;
  background: var(--astral-well);
  box-shadow: var(--astral-edge-well);
}

.pa-hint {
  flex: 1 1 240px;
  text-align: left;
  font-size: 14px;
  line-height: 20px;
  color: var(--vp-c-text-2);
  transition: color 0.15s ease-out;
}

.pa-hint:hover {
  color: var(--vp-c-text-1);
}

.pa-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pa-split {
  position: relative;
  display: flex;
  align-items: stretch;
  height: 36px;
  border-radius: 8px;
  background: var(--astral-raised);
  box-shadow: var(--astral-edge-raised);
}

.pa-main,
.pa-chevron,
.pa-download {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.15s ease-out, transform 0.1s ease-out;
}

.pa-main {
  padding: 0 14px;
  border-radius: 8px 0 0 8px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.pa-chevron {
  width: 36px;
  border-radius: 0 8px 8px 0;
}

.pa-main:hover,
.pa-chevron:hover {
  background: var(--astral-raised-hover);
}

.pa-main:active,
.pa-chevron:active,
.pa-download:active {
  transform: scale(0.98);
}

.pa-divider {
  width: 1px;
  margin: 8px 0;
  background: var(--astral-divider-strong);
}

.pa-download {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--astral-raised);
  box-shadow: var(--astral-edge-raised);
}

.pa-download:hover {
  background: var(--astral-raised-hover);
}

.pa-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
  transition: transform 0.18s cubic-bezier(0.32, 0.72, 0, 1);
}

.pa-icon.is-open {
  transform: rotate(180deg);
}

.pa-menu {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  z-index: 30;
  width: 300px;
  padding: 6px;
  border-radius: 12px;
  background: var(--astral-overlay);
  box-shadow: var(--astral-shadow-overlay);
}

.pa-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  text-align: left;
  transition: background-color 0.15s ease-out;
}

.pa-item:hover,
.pa-item:focus-visible {
  background: var(--astral-raised);
}

.pa-item-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--astral-raised);
  box-shadow: var(--astral-edge-raised);
  color: var(--vp-c-text-1);
}

.pa-item-icon svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.pa-item-icon.is-claude {
  color: #d97757;
}

.pa-item-icon.is-gemini {
  color: #8ab4f8;
}

.pa-item-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pa-item-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--vp-c-text-1);
}

.pa-external {
  width: 14px;
  height: 14px;
  fill: var(--vp-c-text-3);
}

.pa-item-description {
  font-size: 13px;
  line-height: 18px;
  color: var(--vp-c-text-3);
}

.pa-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 100;
  max-width: min(480px, calc(100vw - 32px));
  padding: 12px 16px;
  border-radius: 12px;
  transform: translateX(-50%);
  background: var(--astral-overlay);
  box-shadow: var(--astral-shadow-overlay);
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 20px;
}

.pa-menu-enter-active,
.pa-toast-enter-active {
  transition: opacity 0.2s cubic-bezier(0.32, 0.72, 0, 1), transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.pa-menu-leave-active,
.pa-toast-leave-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}

.pa-menu-enter-from,
.pa-menu-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.pa-toast-enter-from,
.pa-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}

@media (max-width: 640px) {
  .page-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .pa-hint {
    flex: none;
  }

  .pa-controls {
    justify-content: space-between;
  }

  .pa-split {
    flex: 1;
  }

  .pa-main {
    flex: 1;
  }

  .pa-menu {
    left: 0;
    right: auto;
    width: 100%;
    min-width: 280px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pa-icon,
  .pa-menu-enter-active,
  .pa-menu-leave-active,
  .pa-toast-enter-active,
  .pa-toast-leave-active {
    transition: opacity 0.15s linear;
  }
}
</style>
