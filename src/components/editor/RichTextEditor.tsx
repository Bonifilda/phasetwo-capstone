'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Blockquote from '@tiptap/extension-blockquote'
import Placeholder from '@tiptap/extension-placeholder'
import { useRef } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [2, 3],
      }),
      Image.configure({
        inline: false,
      }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
      }),
      Blockquote,
      Placeholder.configure({
        placeholder: 'Write your story...',
      }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  const handleImageUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !editor) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'medium-platform/posts')

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!response.ok || !data.url) {
        console.error('Image upload failed', data)
        return
      }

      editor.chain().focus().setImage({ src: data.url }).run()
    } catch (error) {
      console.error('Image upload error', error)
    } finally {
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (!editor) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 text-gray-500">
        Loading editor...
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-black">
      <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-gray-900 text-black'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-gray-900 text-black'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive('bold') ? 'bg-gray-900 text-black' : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive('italic')
              ? 'bg-gray-900 text-black'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive('bulletList')
              ? 'bg-gray-900 text-black'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive('orderedList')
              ? 'bg-gray-900 text-black'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive('blockquote')
              ? 'bg-gray-900 text-black'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          “ Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive('codeBlock')
              ? 'bg-gray-900 text-black'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          {'</>'}
        </button>
        <button
          type="button"
          onClick={handleImageUploadClick}
          className="px-2 py-1 text-sm rounded text-gray-700 hover:bg-gray-200"
        >
          Image
        </button>
      </div>

      <div className="px-4 py-3 prose prose-lg max-w-none focus:outline-none">
        <EditorContent editor={editor} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  )
}


