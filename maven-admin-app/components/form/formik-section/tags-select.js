import React, { useState, useEffect } from 'react'
import MultiSelect from './multiselect'
import Tag from '../../../lib/models/tag'

function TagsSelectField(props) {
  const [selectOptions, setSelectOptions] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setErrors] = useState('')
  const attr = props.attr
  const name = props.name

  const fetchTags = async () => {
    try {
      let refNumber = null
      const tags = await Tag.getTagsForSelect(refNumber).then((result) => {
        setSelectOptions(result.data)
        return result.data
      })
      return tags
    } catch (error) {
      console.log('Loading Tags Error: ', error)
      return {}
    }
  }

  useEffect(() => {
    // Update the document title using the browser API
    let tags = fetchTags()
    setIsLoading(false)
  }, [])

  return (
    <>
      {isLoading && <div>loading Component...</div>}
      {!isLoading && (
        <MultiSelect attr={attr} options={selectOptions} name={name} />
      )}
    </>
  )
}

export default TagsSelectField
