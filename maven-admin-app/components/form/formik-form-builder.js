import React from 'react'
import { Field } from 'formik'
import Heading from '../form/formik-section/heading'
import TextField from '../form/formik-section/textfield'
import FileField from '../form/formik-section/filefield'
import SelectField from '../form/formik-section/select'
import MultiSelectField from '../form/formik-section/multiselect'
import TagsSelectField from './formik-section/tags-select'
import TestimonialsField from './formik-section/testimonials'
import TestimonialsFaqField from './formik-section/testimonials-faq'
import RichTextEditorField from './formik-section/richTextEditor'

function FormikFormBuilder(props) {
  const schema = props.schema

  return (
    <>
      {Object.keys(schema).map((key, index) => {
        if (schema[key].type == 'legend') {
          return <Heading attr={schema[key]} key={index} />
        }
        if (schema[key].type == 'text') {
          return <TextField attr={schema[key]} name={key} key={index} />
        }
        if (schema[key].type == 'file') {
          return <FileField attr={schema[key]} name={key} key={index} />
        }
        if (schema[key].type == 'select') {
          return <SelectField attr={schema[key]} name={key} key={index} />
        }
        if (schema[key].type == 'multiselect') {
          return (
            <MultiSelectField
              attr={schema[key]}
              options={schema[key].options}
              name={key}
              key={index}
            />
          )
        }
        if (schema[key].type == 'tags-select') {
          return (
            <TagsSelectField
              attr={schema[key]}
              options={schema[key].options}
              name={key}
              key={index}
            />
          )
        }
        if (schema[key].type == 'testimonials') {
          return <TestimonialsField name={key} key={index} />
        }
        if (schema[key].type == 'faq-section-details') {
          return <TestimonialsFaqField name={key} key={index} />
        }
        if (schema[key].type == 'richtexteditor') {
          return (
            <RichTextEditorField attr={schema[key]} name={key} key={index} />
          )
        }
      })}
    </>
  )
}

export default FormikFormBuilder
