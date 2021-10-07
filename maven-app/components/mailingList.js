/* eslint-disable */
import { useEffect, useState } from 'react'
import {
  getErrorMessage,
  hasError,
  isDirty,
  hasFormError,
} from 'lib/validations/validations'
import { useRouter } from 'next/router'
import TextInput from './form/textInput'
import Button from './form/button'
import CheckboxGroup from './form/checkboxGroup'
import Newsletter from 'lib/models/newsletter'

const MailingList = () => {
  let newsletter = new Newsletter({})
  const [modelState, setModelState] = useState(newsletter.getValues())
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [dirtyFieldsState, setDirtyFieldsState] = useState([])
  const router = useRouter()

  // use this process to show only error message on changed/dirty fields
  useEffect(async () => {
    newsletter = new Newsletter(modelState)

    let dirtyFields = newsletter.getDirtyFields(dirtyFieldsState)
    if (dirtyFields.length > 0) {
      setDirtyFieldsState(dirtyFields)
    }

    try {
      await newsletter.validate()
    } catch (error) {
      setErrors(error)
    }
  }, [modelState])

  const subscribeHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})

    newsletter = new Newsletter(modelState)
    newsletter.url = router.pathname

    try {
      await newsletter.save().then((response) => {
        setIsLoading(false)
        setErrors({})

        // reset fields
        newsletter = new Newsletter({})
        setModelState(newsletter.getValues())

        // open success message
        setOpenSuccess(true)
      })
    } catch (error) {
      // set the fields as dirty fields
      let fields = Object.keys(modelState)
      let newDirtyFields = fields.map((key) => {
        return key
      })
      setDirtyFieldsState(newDirtyFields)

      setErrors(error)
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`bg-gray-50 w-full ${
        openSuccess ? 'py-20' : 'md:py-12 py-8'
      } no-printme`}
    >
      <div className="px-5 mx-auto max-w-wrapper">
        <h2 className="mb-5 text-3xl">
          {openSuccess ? 'Thanks for sigining up!' : 'Become a Maven Today'}
          {hasFormError(errors, modelState, dirtyFieldsState) &&
            !openSuccess && (
              <span className="relative inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ml-4 text-xl text-white bg-red-150 bottom-1">
                !
              </span>
            )}
        </h2>
        {openSuccess && (
          <p className="text-lg">
            We'll let you know about new events, classes, and promotions.
          </p>
        )}
        {!openSuccess && (
          <form onSubmit={subscribeHandler}>
            <div className="flex flex-wrap justify-between md:space-x-10 md:flex-nowrap">
              <div className="w-1/2 pr-3 md:w-auto md:pr-0">
                <TextInput
                  width="xs"
                  type="text"
                  name="first_name"
                  id="first-name"
                  placeholder="First Name"
                  required={false}
                  disabled={isLoading}
                  errorClass={
                    hasError(errors, 'first_name') &&
                    isDirty(dirtyFieldsState, 'first_name')
                      ? 'error'
                      : ''
                  }
                  onChange={(e) => {
                    const newModelState = { ...modelState }
                    newModelState.first_name = e.target.value
                    setModelState(newModelState)
                  }}
                />
                {hasError(errors, 'first_name') &&
                  isDirty(dirtyFieldsState, 'first_name') && (
                    <p className="mt-2 text-xs text-red-150">
                      {getErrorMessage(errors, 'first_name')}
                    </p>
                  )}
              </div>
              <div className="w-1/2 pl-3 md:w-auto md:pl-0">
                <TextInput
                  width="xs"
                  type="text"
                  name="last_name"
                  id="last-name"
                  placeholder="Last Name"
                  required={false}
                  disabled={isLoading}
                  errorClass={
                    hasError(errors, 'last_name') &&
                    isDirty(dirtyFieldsState, 'last_name')
                      ? 'error'
                      : ''
                  }
                  onChange={(e) => {
                    const newModelState = { ...modelState }
                    newModelState.last_name = e.target.value
                    setModelState(newModelState)
                  }}
                />
                {hasError(errors, 'last_name') &&
                  isDirty(dirtyFieldsState, 'last_name') && (
                    <p className="mt-2 text-xs text-red-150">
                      {getErrorMessage(errors, 'last_name')}
                    </p>
                  )}
              </div>
              <div className="w-full mt-5 md:mt-0 md:w-5/12">
                <TextInput
                  width="sm"
                  type="email"
                  name="email"
                  id="email-subscribe"
                  placeholder="Email"
                  required={false}
                  width="full"
                  disabled={isLoading}
                  errorClass={
                    hasError(errors, 'email') &&
                    isDirty(dirtyFieldsState, 'email')
                      ? 'error'
                      : ''
                  }
                  onChange={(e) => {
                    const newModelState = { ...modelState }
                    newModelState.email = e.target.value
                    setModelState(newModelState)
                  }}
                />
                {hasError(errors, 'email') &&
                  isDirty(dirtyFieldsState, 'email') && (
                    <p className="mt-2 text-xs text-red-150">
                      {getErrorMessage(errors, 'email')}
                    </p>
                  )}
              </div>
              <div className="hidden lg:block">
                <Button
                  type="submit"
                  disabled={isLoading}
                  subscribe={true}
                  buttonContent={isLoading ? '...' : 'Subscribe'}
                  style="blue"
                />
              </div>
            </div>
            <div className="pt-4 sm:pt-5">
              <CheckboxGroup
                label="Mailing list"
                disabled={isLoading}
                options={[
                  {
                    label:
                      'I agree to be added to the mailing list and understand that I may opt out at any time.',
                    id: 'consent',
                    value: true,
                    name: 'consent',
                    errorClass:
                      hasError(errors, 'consent') &&
                      isDirty(dirtyFieldsState, 'consent')
                        ? 'error'
                        : '',
                  },
                ]}
                valueProp={(newValue) => {
                  const newModelState = { ...modelState }
                  newModelState.consent = newValue.consent ? 'true' : ''
                  setModelState(newModelState)
                }}
                hideLabel={true}
              />
            </div>
            {hasError(errors, 'consent') &&
              isDirty(dirtyFieldsState, 'consent') && (
                <p className="mt-2 text-xs text-red-150">
                  {getErrorMessage(errors, 'consent')}
                </p>
              )}
            <div className="flex items-center justify-center pb-2 mt-6 lg:hidden sm:justify-start">
              <Button
                type="submit"
                disabled={isLoading}
                subscribe={true}
                buttonContent={isLoading ? '...' : 'Subscribe'}
                style="blue"
              />
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
export default MailingList
