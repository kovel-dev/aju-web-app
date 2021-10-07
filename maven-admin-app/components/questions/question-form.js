import * as Cx from '@coreui/react'
import Link from 'next/link'
import Question from '../../lib/models/question'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { server } from '../../lib/config/server'
import { getErrorMessage, hasError } from '../../lib/validations/validations'

function QuestionForm(props) {
  const isEdit = props.edit ? true : false
  const router = useRouter()
  let question = new Question({})

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [questionState, setQuestionState] = useState(question.getValues())

  if (isEdit) {
    useEffect(async () => {
      setIsLoading(true)
      const query = router.query

      if (query) {
        const refNumber = query.id
        await question
          .getQuestionByRef(refNumber)
          .then((questionInfo) => {
            question = new Question(questionInfo)
            setQuestionState(question)
            setIsLoading(false)
          })
          .catch(function (err) {
            setErrors(err.response.data)
            setIsLoading(false)
            return
          })
      }
    }, [])
  }

  const submitHandler = async () => {
    setIsLoading(true)
    setErrors({})

    question = new Question(questionState)
    try {
      if (isEdit) {
        const query = router.query

        if (query) {
          const refNumber = query.id
          await question.update(refNumber).then((response) => {
            router.replace(`${server}/questions`)
          })
        }
      } else {
        await question.save().then((response) => {
          router.replace(`${server}/questions`)
        })
      }
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-5 container-fluid">
      <Link href={`${server}/questions`}>
        <a className="btn btn-link">Go Back to List</a>
      </Link>
      {hasError(errors, 'general') && (
        <Cx.CCallout color="danger">
          {getErrorMessage(errors, 'general')}
        </Cx.CCallout>
      )}
      <Cx.CCard>
        <Cx.CCardHeader>
          {isEdit ? 'Edit Question' : 'Create Question'}
        </Cx.CCardHeader>
        <Cx.CCardBody>
          <Cx.CForm
            className="row g-3"
            onSubmit={() => {
              return false
            }}
          >
            <Cx.CCol md="12">
              <Cx.CFormLabel htmlFor="label">Question</Cx.CFormLabel>
              <Cx.CFormControl
                id="label"
                name="label"
                type="text"
                invalid={hasError(errors, 'label') ? true : false}
                value={questionState.label}
                disabled={isLoading}
                onChange={(e) => {
                  const newQuestionState = { ...questionState }
                  newQuestionState.label = e.target.value
                  setQuestionState(newQuestionState)
                }}
              />
              {hasError(errors, 'label') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'label')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="type">Type</Cx.CFormLabel>
              <Cx.CFormSelect
                id="type"
                name="type"
                disabled={isLoading}
                invalid={hasError(errors, 'type') ? true : false}
                value={questionState.type}
                onChange={(e) => {
                  const newQuestionState = { ...questionState }
                  newQuestionState.type = e.target.value
                  setQuestionState(newQuestionState)
                }}
              >
                <option value="">Select Type</option>
                {Object.keys(question.getTypes()).map(function (key, index) {
                  return (
                    <option value={key} key={index}>
                      {question.getTypes()[key]}
                    </option>
                  )
                })}
              </Cx.CFormSelect>
              {hasError(errors, 'type') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'type')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="options">Options</Cx.CFormLabel>
              <Cx.CFormControl
                id="options"
                name="options"
                type="text"
                invalid={hasError(errors, 'options') ? true : false}
                value={
                  questionState.type.indexOf('text') !== -1
                    ? ''
                    : questionState.options
                }
                disabled={
                  isLoading || questionState.type.indexOf('text') !== -1
                }
                onChange={(e) => {
                  const newQuestionState = { ...questionState }
                  newQuestionState.options = e.target.value
                  setQuestionState(newQuestionState)
                }}
              />
              {hasError(errors, 'options') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'options')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="12">
              <Cx.CButton
                type="button"
                color="primary"
                disabled={isLoading}
                onClick={() => submitHandler()}
              >
                {isLoading && <Cx.CSpinner component="span" size="sm" />}
                {isLoading ? '' : isEdit ? 'Update' : 'Create'}
              </Cx.CButton>
            </Cx.CCol>
          </Cx.CForm>
        </Cx.CCardBody>
      </Cx.CCard>
    </div>
  )
}

export default QuestionForm
