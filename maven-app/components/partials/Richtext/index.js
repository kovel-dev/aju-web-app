import React from 'react'

export const Richtext = ({ text, className }) => {
  return (
    <div
      className={`richcontent`}
      contentEditable="false"
      dangerouslySetInnerHTML={{ __html: text }}
    ></div>
  )
}
