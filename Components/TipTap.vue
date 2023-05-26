<template>
  <div v-if="editor">
    <div class="flex flex-col gap-1 p-1 mb-1 border-2 border-gray-300 dark:border-gray-700 select-none">
      <div class="flex justify-between gap-2">
        <div class="flex items-center gap-1">
          <div
            class="p-1 shadow-sm inline-block border-2 border-gray-300 dark:border-gray-700 cursor-pointer"
            :class="editor.isActive('paragraph') ? props.buttonActiveClass : props.buttonClass"
            @click="editor.chain().focus().setParagraph().run()"
          >
            <i-carbon:paragraph />
          </div>
          <div class="border-2 border-gray-300 dark:border-gray-700 text-sm text-center grid grid-cols-3 overflow-hidden">
            <div
              class="p-1 px-1.5" :class="editor.isActive('heading', { level: 1 }) ? props.buttonActiveClass : props.buttonClass"
              @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            >
              H1
            </div>
            <div
              class="p-1 px-1.5" :class="editor.isActive('heading', { level: 2 }) ? props.buttonActiveClass : props.buttonClass"
              @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            >
              H2
            </div>
            <div
              class="p-1 px-1.5" :class="editor.isActive('heading', { level: 3 }) ? props.buttonActiveClass : props.buttonClass"
              @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            >
              H3
            </div>
          </div>
          <div
            class="p-1 shadow-sm inline-block border-2 border-gray-300 dark:border-gray-700 cursor-pointer"
            :class="editor.isActive('bulletList') ? props.buttonActiveClass : props.buttonClass"
            @click="editor.chain().focus().toggleBulletList().run()"
          >
            <i-carbon:list-bulleted />
          </div>
          <div
            class="p-1 shadow-sm inline-block border-2 border-gray-300 dark:border-gray-700 cursor-pointer"
            :class="editor.isActive('orderedList') ? props.buttonActiveClass : props.buttonClass"
            @click="editor.chain().focus().toggleOrderedList().run()"
          >
            <i-carbon:list-numbered />
          </div>
          <div
            class="p-1 shadow-sm inline-block border-2 border-gray-300 dark:border-gray-700 cursor-pointer"
            :class="editor.isActive('bold') ? props.buttonActiveClass : props.buttonClass"
            @click="editor.chain().focus().toggleBold().run()"
          >
            <i-carbon:text-bold />
          </div>
          <div
            class="p-1 shadow-sm inline-block border-2 border-gray-300 dark:border-gray-700 cursor-pointer"
            :class="editor.isActive('italic') ? props.buttonActiveClass : props.buttonClass"
            @click="editor.chain().focus().toggleItalic().run()"
          >
            <i-carbon:text-italic />
          </div>
          <div
            class="p-1 shadow-sm inline-block border-2 border-gray-300 dark:border-gray-700 cursor-pointer"
            :class="editor.isActive('underline') ? props.buttonActiveClass : props.buttonClass"
            @click="editor.chain().focus().toggleUnderline().run()"
          >
            <i-carbon:text-underline />
          </div>
        </div>
      </div>
    </div>

    <EditorContent :editor="editor" class="prose prose-p:mt-0 prose-p:mb-1 dark:prose-invert max-w-none focus:outline-none border-2 border-gray-300 dark:border-gray-700 p-2" />
  </div>
</template>

<script setup>
import { EditorContent, useEditor } from '@tiptap/vue-3'

import StarterKit from '@tiptap/starter-kit'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  buttonClass: {
    type: String,
    default: 'bg-gray-50 dark:bg-gray-900',
  },
  buttonActiveClass: {
    type: String,
    default: 'bg-gray-200 dark:bg-gray-600',
  },
})
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  editorProps: {
    transformPastedHTML(html) {
      return html.replace(/&nbsp;/g, ' ')
    },
  },
  extensions: [
    StarterKit,
    ListItem,
    BulletList,
    OrderedList,
    Document,
    Bold,
    Italic,
    Underline,
    Paragraph,
    Text,
    Heading,
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.value.getHTML())
  },
})

watch(() => props.modelValue, (newValue) => {
  const isSame = newValue === editor.value.getHTML()
  if (isSame) {
    return
  }
  editor.value?.commands.setContent(newValue, false, {
    preserveWhitespace: 'full',
  })
})
</script>
