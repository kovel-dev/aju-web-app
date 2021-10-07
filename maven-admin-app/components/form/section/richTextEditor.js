import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  convertToRaw,
  convertFromRaw,
  convertFromHTML,
  EditorState,
  ContentState,
} from 'draft-js'

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import StateManager from 'react-select'

const toolbar = {
  options: ['inline', 'list', 'link', 'remove'],
  inline: {
    options: ['bold', 'italic', 'underline'],
  },
}

const RichTextEditor = (props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)
    const rawValue = convertToRaw(editorState.getCurrentContent())

    const newTagState = { ...props.fieldValues }
    newTagState[props.id] = JSON.stringify(rawValue)
    props.fieldValuesHandler(newTagState)
  }

  useEffect(() => {
    if (props.value) {
      let state
      try {
        state = convertFromRaw(JSON.parse(props.value))
      } catch {
        const blocksFromHTML = convertFromHTML(`<p>${props.value}<p>`)
        state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      }
      setEditorState(EditorState.createWithContent(state))
    }
  }, [])

  return (
    <div
      className="py-3 sm:border-b sm:border-gray-200"
      aria-labelledby={`fm-textbox-${props.name}`}
      key={props.name}
    >
      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        >
          {props.label}
          {props.isRequired ? '*' : ''}
        </label>
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <Editor
            key={props.id}
            editorState={editorState}
            toolbar={toolbar}
            onEditorStateChange={onEditorStateChange}
            wrapperClassName="block w-full max-w-lg border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            editorStyle={{ padding: '0 20px' }}
          />
          {props.invalid && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {props.errMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RichTextEditor
