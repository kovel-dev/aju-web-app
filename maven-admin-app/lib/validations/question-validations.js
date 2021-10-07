import * as Yup from 'yup'
import Question from '../models/question'

const QuestionSchema = () => {
  let question = new Question({})

  let yupObj = {
    label: Yup.string()
      .min(2, { key: 'name', values: 'The field is too short' })
      .max(255, { key: 'name', values: 'The field is too long' })
      .required({ key: 'name', values: 'Label is required' }),
    type: Yup.mixed()
      .required({ key: 'type', values: 'Type is required' })
      .oneOf(Object.keys(question.getTypes()), {
        key: 'type',
        values: 'Select type',
      }),
    options: Yup.mixed().test({
      name: 'required_options',
      exclusive: false,
      message: { key: 'options', values: 'Options is required' },
      test: function (value) {
        if (
          this.parent.type.indexOf('text') === -1 &&
          this.parent.type.length > 0
        ) {
          if (value.length <= 0) {
            return false
          }
        }

        return true
      },
    }),
  }

  return Yup.object().shape(yupObj)
}

export const validateQuestionForm = async (enteredData) => {
  return await QuestionSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
