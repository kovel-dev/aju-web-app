import * as Yup from 'yup'

const ArticleSchema = () => {
  let yupObj = {
    title: Yup.string()
      .min(2, { key: 'title', values: 'The field is too short' })
      .max(255, { key: 'title', values: 'The field is too long' })
      .required({ key: 'title', values: 'Title is required' }),
    link: Yup.string()
      .min(2, { key: 'link', values: 'The field is too short' })
      .max(255, { key: 'link', values: 'The field is too long' })
      .required({ key: 'link', values: 'Link is required' }),
  }

  return Yup.object().shape(yupObj)
}

export const validateArticleForm = async (enteredData) => {
  return await ArticleSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
