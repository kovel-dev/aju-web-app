/* eslint-disable */
import { useState, useEffect } from 'react'
import { getErrorMessage, hasError } from 'lib/validations/validations'
import FormTemplate from '@components/form/formTemplate'
import UseForm from '@components/form/UseForm'
import Success from '@components/popup/success'
import User from 'lib/models/user'
import Loader from '@components/loader'
import PartnerRequest from 'lib/models/partner-request'
import { server } from 'lib/config/server'

const PartnerForm = ({ closeProp, eventData, partnerBuyType }) => {
  let user = new User({})
  const [clickSubmit, setClickSubmit] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [open, setOpen] = useState(true)
  // variable to toggle loading gif
  const [isLoading, setIsLoading] = useState(true)
  // variable to hold changing loading message
  const [loadingMessage, setLoadingMessage] = useState('Loading...')
  // variable to toggle error message
  const [errors, setErrors] = useState({})
  // variable to hold the user's record
  const [userState, setUserState] = useState(user.getValues(true))
  const [refreshNum, setRefreshNum] = useState(1)

  const updateUserInput = (newUserInput) => {
    if (newUserInput) {
      for (const key in newUserInput) {
        updateSingleInput({ key: key, value: newUserInput[key] })
      }
    }
  }

  useEffect(() => {
    getCurrentUser()
  }, [])

  useEffect(() => {
    if (!open) {
      closeProp()
    }
  }, [open])

  const partnerSchema = {
    add_on: { value: '', error: 'Add-on field is required.' },
    name: { value: '', error: 'Name field is required.' },
    seats_reserved: {
      value: '',
      error: 'Number of seats you want to reserve is required.',
    },
    details: { value: '', error: 'Additional Details field is required.' },
    organization: { value: '', error: 'Organization field is required.' },
    phone: { value: '', error: '' },
    contact_email: { value: '', error: 'Email field is required.' },
    prefer_phone: { value: false, error: '' },
  }

  const partnerValidationSchema = {
    name: {
      required: true,
      validator: {
        regEx: /^((?!null).)([a-zA-Zâêîôûéàèùçäëïü0-9 '.,-]*)$/,
        error: 'Invalid format.',
      },
    },
    add_on: {
      required: true,
      error: 'Add-on field is required.',
    },
    seats_reserved: {
      required: true,
      validator: {
        regEx: /^((?!null).)([0-9 '.,-]*)$/,
        error: 'Invalid format. Numbers only.',
      },
    },
    details: {
      required: true,
      validator: {
        regEx: /.*/i,
        error: 'Additional Details field is required.',
      },
      minLength: 25,
      maxLength: 3000,
      multiWord: true,
    },
    organization: {
      required: true,
      validator: {
        regEx: /^((?!null).)([a-zA-Zâêîôûéàèùçäëïü0-9 '.,-]*)$/,
        error: 'Invalid format.',
      },
    },
    phone: {
      required: false,
      validator: {
        regEx: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        error: 'Invalid format.',
      },
    },
    contact_email: {
      required: true,
      validator: {
        regEx:
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
        error: 'Please enter a valid email address.',
      },
    },
    prefer_phone: {
      required: false,
      error: '',
    },
  }

  const submitForm = async () => {
    setIsLoading(true)
    setLoadingMessage('Submitting...')

    let model = new PartnerRequest({
      add_on: partnerData.add_on.value,
      name: partnerData.name.value,
      seats_reserved: partnerData.seats_reserved.value,
      details: partnerData.details.value,
      organization: partnerData.organization.value,
      phone: partnerData.phone.value,
      contact_email: partnerData.contact_email.value,
      prefer_phone: partnerData.prefer_phone.value,
      link: `${server}/events-classes/program/${eventData.slug}`,
      event_name: eventData.name,
    })

    await model
      .save()
      .then((response) => {
        setIsLoading(false)
        // open success message
        setOpenSuccess(true)
        handleReset()

        // // increment the number for force the template component to re-render
        setRefreshNum(parseInt(refreshNum) + 1)
      })
      .catch((error) => {
        setIsLoading(false)
        setErrors(error.response.data)
        let formattedError = []
        for (let index = 0; index < error.length; index++) {
          const item = error[index]

          let key = item.key
          let errorMsg = item.values
          const data = partnerData[key]

          formattedError.push({
            key: key,
            value: { value: data.value, error: errorMsg },
          })
        }

        handleBEerror(formattedError)
      })
  }

  const {
    formData: partnerData,
    handleOnChange,
    handleOnSubmit,
    handleReset,
    handleBEerror,
    updateSingleInput,
  } = UseForm(partnerSchema, partnerValidationSchema, submitForm)

  useEffect(() => {
    let hasError = false
    for (const key in partnerData) {
      const item = key.split('_').join('-')
      let itemHasError =
        partnerData[key].value.length > 0 && partnerData[key].error

      if (itemHasError) {
        hasError = true
        document.getElementById(item).classList.add('error')
      } else if (document.getElementById(item) && !itemHasError) {
        document.getElementById(item).classList.remove('error')
      }
    }
    setClickSubmit(hasError)
  }, [partnerData])

  useEffect(() => {
    if (userState.email.length > 0 && isLoading == false) {
      // update partnerData values
      if (partnerData.name.value.length <= 0) {
        updateSingleInput({
          key: 'name',
          value: userState.first_name + ' ' + userState.last_name,
        })
        document.getElementById('name').value =
          userState.first_name + ' ' + userState.last_name
      }

      if (partnerData.organization.value.length <= 0) {
        updateSingleInput({
          key: 'organization',
          value: userState.organization.name,
        })
        document.getElementById('organization').value =
          userState.organization.name
      }

      if (partnerData.phone.value.length <= 0) {
        updateSingleInput({
          key: 'phone',
          value: userState.organization.office_number,
        })
        document.getElementById('phone').value =
          userState.organization.office_number
      }

      if (partnerData.contact_email.value.length <= 0) {
        updateSingleInput({ key: 'contact_email', value: userState.email })
        document.getElementById('contact-email').value = userState.email
      }

      if (partnerData.add_on.value.length <= 0) {
        updateSingleInput({ key: 'add_on', value: partnerBuyType })
        document.getElementById('add-on').value = partnerBuyType
      }
    }
  }, [isLoading])

  // get current user process
  const getCurrentUser = async () => {
    setIsLoading(true)

    // get user profile
    let userRes = null
    try {
      await user.getProfile().then((response) => {
        userRes = response
      })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }

    if (userRes) {
      // initialize response data to user model to format data
      user = new User(userRes)
      // set user data to userState
      setUserState(user.getValues(true))
    }
    setIsLoading(false)
  }

  return (
    <>
      {!openSuccess && open && (
        <div
          className="absolute inset-0 transition-opacity z-50 h-screen w-full bg-transparent"
          aria-hidden="true"
          id="delete-overlay"
        >
          <div className="fixed inset-0 bg-gray-500 opacity-75 z-10"></div>
          <div className="modal mx-auto bg-white rounded-sm text-left overflow-hidden max-w-title z-40 relative sm:top-1/4 top-1/12 top-14">
            <div className="title-bar flex text-2xl font-bold mb-1 justify-end pt-3 sm:px-3 px-5">
              <button
                onClick={() => {
                  setOpen(false)
                }}
                className="focus:outline-none bg-blue-850 rounded-sm text-white text-sm px-3 py-2"
              >
                &#10005;
              </button>
            </div>
            {isLoading && (
              <div className="w-full mb-10">
                <Loader message={loadingMessage} />
              </div>
            )}
            {!isLoading && (
              <FormTemplate
                key={refreshNum}
                updateUserInputProp={updateUserInput}
                submitContent="Submit"
                suggestion={true}
                addOn={true}
                popup={true}
                onSubmitProp={(e) => {
                  e.preventDefault()
                  handleOnSubmit(e)
                  setClickSubmit(true)
                }}
                schema={[
                  {
                    type: 'heading',
                    heading: 'Partner Add-on Request Form',
                    description: 'Please select your preferred add-on',
                  },
                  {
                    type: 'select',
                    label: '',
                    id: 'add-on',
                    name: 'add_on',
                    onChange: handleOnChange,
                    value: partnerData.add_on.value,
                    error: clickSubmit ? partnerData.add_on.error : '',
                    options: [
                      {
                        key: '',
                        value: 'Select Add-on',
                      },
                      {
                        key: 'buy-class-event',
                        value: 'Buy entire class or event',
                      },
                      {
                        key: 'reserve-seats',
                        value: 'Reserve number of seats for my members',
                      },
                    ],
                    width: 'full',
                    placeholder: 'Add-on',
                  },
                  {
                    type: 'break',
                    text: '(if applicable)',
                  },
                  {
                    type: 'text',
                    label: 'Number of seats reserved',
                    id: 'seats-reserved',
                    name: 'seats_reserved',
                    autoComplete: 'seats-reserved',
                    placeholder: 'Number of seats you want reserved',
                    disabled: false,
                    required: true,
                    width: 'full',
                    onChange: handleOnChange,
                    value: partnerData.seats_reserved.value,
                    error: clickSubmit ? partnerData.seats_reserved.error : '',
                  },
                  {
                    type: 'textarea',
                    label: 'Additional Details',
                    id: 'details',
                    instructions: '',
                    name: 'details',
                    autoComplete: '',
                    placeholder: 'Additional Details',
                    disabled: false,
                    required: true,
                    rows: 7,
                    onChange: handleOnChange,
                    value: partnerData.details.value,
                    error: clickSubmit ? partnerData.details.error : '',
                  },
                  {
                    type: 'text',
                    label: 'Name',
                    id: 'name',
                    name: 'name',
                    autoComplete: 'name',
                    placeholder: 'Name',
                    disabled: false,
                    required: true,
                    width: 'full',
                    onChange: handleOnChange,
                    value: partnerData.name.value,
                    error: clickSubmit ? partnerData.name.error : '',
                  },
                  {
                    type: 'text',
                    label: 'Affiliated Organization',
                    id: 'organization',
                    name: 'organization',
                    autoComplete: 'organization',
                    placeholder: 'Affiliated Organization',
                    disabled: false,
                    required: true,
                    width: 'full',
                    onChange: handleOnChange,
                    value: partnerData.organization.value,
                    error: clickSubmit ? partnerData.organization.error : '',
                  },
                  {
                    type: 'email',
                    label: 'Email',
                    id: 'contact-email',
                    name: 'contact_email',
                    autoComplete: '',
                    placeholder: 'Email',
                    disabled: false,
                    required: true,
                    width: 'full',
                    onChange: handleOnChange,
                    value: partnerData.contact_email.value,
                    error: clickSubmit ? partnerData.contact_email.error : '',
                  },
                  {
                    type: 'phone',
                    id: 'phone',
                    name: 'phone',
                    autoComplete: '',
                    placeholder: 'Mobile Number',
                    disabled: false,
                    required: false,
                    width: 'full',
                    onChange: handleOnChange,
                    value: partnerData.phone.value,
                    error: clickSubmit ? partnerData.phone.error : '',
                  },
                  {
                    type: 'checkbox',
                    label: 'I prefer to be contacted by phone',
                    id: 'prefer-phone',
                    onChange: updateUserInput,
                    options: [
                      {
                        label: 'I prefer to be contacted by phone',
                        id: 'prefer-phone',
                        name: 'prefer_phone',
                        value: '',
                      },
                    ],
                  },
                ]}
              />
            )}
            {!isLoading && hasError(errors, 'general') && (
              <div className="w-full mb-10">
                <div className="justify-center mx-auto max-w-wrapper">
                  <p className="text-center text-red-600">
                    {getErrorMessage(errors, 'general')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {openSuccess && (
        <Success
          open={openSuccess}
          icon="/images/success-check.png"
          title="Your request has been submitted"
          description="A member of our team will be in touch regarding your request."
          check={true}
          closeProp={() => {
            setOpenSuccess(false)
            setOpen(false)
          }}
        />
      )}
    </>
  )
}

export default PartnerForm
