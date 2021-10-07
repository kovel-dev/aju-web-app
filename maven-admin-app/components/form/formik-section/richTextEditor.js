import React, { useState, useEffect } from 'react'
import { Field, ErrorMessage } from 'formik'
import dynamic from 'next/dynamic'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
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

const toolbar = {
  options: ['inline', 'list', 'link', 'remove'],
  inline: {
    options: ['bold', 'italic', 'underline'],
  },
}

function RichTextEditorField(props) {
  const attr = props.attr
  const name = props.name
  const key = props.key

  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)
    const rawValue = convertToRaw(editorState.getCurrentContent())

    const newTagState = { ...props.fieldValues }
    newTagState[props.attr.label.toLowerCase()] = JSON.stringify(rawValue)
    props.fieldValuesHandler(newTagState)
  }

  useEffect(() => {
    if (props.fieldValues) {
      let state = ''
      let field = props.attr.label.toLowerCase()
      let fieldValues = props.fieldValues

      try {
        state = convertFromRaw(JSON.parse(fieldValues[field]))
      } catch {
        const blocksFromHTML = convertFromHTML(`<p>${fieldValues[field]}<p>`)
        state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      }
      setEditorState(EditorState.createWithContent(state))
    }
  }, [props.fieldKey])

  return (
    <>
      <div className="pl-4 py-3 sm:border-b sm:border-gray-200" key={name}>
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
          <label
            htmlFor={name}
            className="block text-lg mb-2 sm:text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            {attr.label}
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <Editor
              key={key}
              name={name}
              editorState={editorState}
              toolbar={toolbar}
              onEditorStateChange={onEditorStateChange}
              wrapperClassName="block w-full max-w-lg border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              editorStyle={{ padding: '0 20px' }}
            />
            <p className="mt-2 text-sm text-red-600" id="email-error">
              <ErrorMessage name={name} />
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default RichTextEditorField
