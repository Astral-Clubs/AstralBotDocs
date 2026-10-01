<script setup lang="ts">
import { computed } from 'vue'
import { mdiArrowTopRight, mdiContentCopy } from '@mdi/js'

type ButtonStyle = 'default' | 'primary' | 'success' | 'danger' | 'link' | 'copy' | 'disabled'
type PreviewButton = { text: string; style: ButtonStyle }

const props = withDefaults(
  defineProps<{
    user?: string
    userName?: string
    buttons?: string[][]
    reaction?: string
    ephemeral?: boolean
    time?: string
    label?: string
    botName?: string
  }>(),
  {
    user: '',
    userName: 'Вы',
    buttons: () => [],
    reaction: '',
    ephemeral: false,
    time: '14:02',
    label: 'Как это выглядит в Telegram',
    botName: 'Astral Moderation'
  }
)

const styles: ButtonStyle[] = ['default', 'primary', 'success', 'danger', 'link', 'copy', 'disabled']

const rows = computed<PreviewButton[][]>(() =>
  props.buttons.map((row) =>
    row.map((raw) => {
      const separator = raw.lastIndexOf('|')
      const style = separator > -1 ? (raw.slice(separator + 1).trim() as ButtonStyle) : 'default'
      return {
        text: separator > -1 ? raw.slice(0, separator).trim() : raw,
        style: styles.includes(style) ? style : 'default'
      }
    })
  )
)
</script>

<template>
  <figure class="tg-preview">
    <figcaption class="tg-caption">{{ label }}</figcaption>
    <div class="tg-chat">
      <div v-if="user" class="tg-row tg-row-out">
        <div class="tg-bubble tg-bubble-out">
          <div class="tg-name tg-name-out">{{ userName }}</div>
          <span class="tg-plain">{{ user }}</span>
          <span class="tg-time">{{ time }}</span>
        </div>
      </div>

      <div class="tg-row">
        <div class="tg-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 2.5c.9 5.2 4.3 8.6 9.5 9.5-5.2.9-8.6 4.3-9.5 9.5-.9-5.2-4.3-8.6-9.5-9.5 5.2-.9 8.6-4.3 9.5-9.5Z" /></svg>
        </div>
        <div class="tg-stack">
          <div class="tg-bubble">
            <div class="tg-name">{{ botName }}</div>
            <div class="tg-content"><slot /></div>
            <div class="tg-meta">
              <span v-if="ephemeral" class="tg-ephemeral">видно только вам</span>
              <span class="tg-time">{{ time }}</span>
            </div>
          </div>
          <div v-if="reaction" class="tg-reaction">{{ reaction }} <span>1</span></div>
          <div v-if="rows.length" class="tg-keyboard">
            <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="tg-keyboard-row">
              <span
                v-for="(button, buttonIndex) in row"
                :key="buttonIndex"
                class="tg-button"
                :class="`is-${button.style}`"
              >
                {{ button.text }}
                <svg v-if="button.style === 'link'" class="tg-button-mark" viewBox="0 0 24 24" aria-hidden="true">
                  <path :d="mdiArrowTopRight" />
                </svg>
                <svg v-else-if="button.style === 'copy'" class="tg-button-mark" viewBox="0 0 24 24" aria-hidden="true">
                  <path :d="mdiContentCopy" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </figure>
</template>
