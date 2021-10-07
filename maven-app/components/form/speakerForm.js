/* eslint-disable */
import { useState, useEffect } from 'react'
import FormTemplate from '@components/form/formTemplate'
import UseForm from '@components/form/UseForm'
import Success from '@components/popup/success'
import HostForm from 'lib/models/host-form'

const SpeakerForm = ({ closeProp, selectedSpeakers }) => {
  const [clickSubmit, setClickSubmit] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [open, setOpen] = useState(true)
  const [userInput, setUserInput] = useState('')
  const [refreshNum, setRefreshNum] = useState(1)

  const updateUserInput = (newUserInput) => {
    if (newUserInput) {
      for (const key in newUserInput) {
        updateSingleInput({ key: key, value: newUserInput[key] })
      }
    }
  }

  useEffect(() => {
    if (!open) {
      closeProp()
    }
  }, [open])

  const speakerSchema = {
    name: { value: '', error: 'Name field is required.' },
    title: { value: '', error: 'Title field is required.' },
    organization: { value: '', error: 'Organization field is required.' },
    phone: { value: '', error: '' },
    contact_email: { value: '', error: 'Email field is required.' },
    prefer_phone: { value: false, error: '' },
    date: { value: '', error: 'Name field is required.' },
    type: { value: '', error: 'Name field is required.' },
    location: { value: '', error: 'Name field is required.' },
    speaker_meta: { value: selectedSpeakers, error: '' },
  }

  const speakerValidationSchema = {
    name: {
      required: true,
      validator: {
        regEx: /^((?!null).)([a-zA-Zâêîôûéàèùçäëïü0-9 '.,-]*)$/,
        error: 'Invalid format.',
      },
    },
    title: {
      required: true,
      validator: {
        regEx: /^((?!null).)([a-zA-Zâêîôûéàèùçäëïü0-9 '.,-]*)$/,
        error: 'Invalid format.',
      },
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
    date: {
      required: true,
      validator: {
        regEx: /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
        error: 'Invalid format.',
      },
    },
    type: {
      required: true,
      validator: {
        regEx: /^((?!null).)([a-zA-Zâêîôûéàèùçäëïü0-9 '.,-]*)$/,
        error: 'Invalid format.',
      },
    },
    location: {
      required: true,
      validator: {
        regEx: /^((?!null).)([a-zA-Zâêîôûéàèùçäëïü0-9 '.,-]*)$/,
        error: 'Invalid format.',
      },
    },
  }

  const submitForm = async () => {
    let model = new HostForm({
      name: speakerData.name.value,
      title: speakerData.title.value,
      organization: speakerData.organization.value,
      phone: speakerData.phone.value,
      contact_email: speakerData.contact_email.value,
      prefer_phone: speakerData.prefer_phone.value,
      date: speakerData.date.value,
      type: speakerData.type.value,
      location: speakerData.location.value,
      speaker_meta: speakerData.speaker_meta.value,
    })

    await model
      .save()
      .then((response) => {
        // open success message
        setOpenSuccess(true)
        handleReset()

        // increment the number for force the template component to re-render
        setRefreshNum(parseInt(refreshNum) + 1)
      })
      .catch((error) => {
        let formattedError = []
        for (let index = 0; index < error.length; index++) {
          const item = error[index]

          let key = item.key
          let errorMsg = item.values
          const data = speakerData[key]

          formattedError.push({
            key: key,
            value: { value: data.value, error: errorMsg },
          })
        }

        handleBEerror(formattedError)
      })
  }

  const {
    formData: speakerData,
    handleOnChange,
    handleOnSubmit,
    handleReset,
    handleBEerror,
    updateSingleInput,
  } = UseForm(speakerSchema, speakerValidationSchema, submitForm)

  useEffect(() => {
    let hasError = false
    for (const key in speakerData) {
      const item = key.split('_').join('-')
      let itemHasError =
        speakerData[key].value.length > 0 && speakerData[key].error

      if (itemHasError) {
        hasError = true
        document.getElementById(item).classList.add('error')
      } else if (document.getElementById(item) && !itemHasError) {
        document.getElementById(item).classList.remove('error')
      }
    }
    setClickSubmit(hasError)
  }, [speakerData])

  return (
    <>
      {!openSuccess && open && (
        <div
          className="absolute inset-0 transition-opacity z-50 h-screen w-screen bg-transparent"
          aria-hidden="true"
          id="delete-overlay"
        >
          <div className="fixed inset-0 bg-gray-500 opacity-75 z-10"></div>
          <div className="modal mx-auto bg-white rounded-sm text-left overflow-hidden max-w-form z-40 relative sm:top-1/4 top-1/12 top-14">
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
            <FormTemplate
              key={refreshNum}
              updateUserInputProp={updateUserInput}
              submitContent="Submit Request"
              popup={true}
              onSubmitProp={(e) => {
                e.preventDefault()
                handleOnSubmit(e)
                setClickSubmit(true)
              }}
              schema={[
                {
                  type: 'heading',
                  heading:
                    'I would like to book an AJU speaker for a private event',
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
                  value: speakerData.name.value,
                  error: clickSubmit ? speakerData.name.error : '',
                },
                {
                  type: 'text',
                  label: 'Title',
                  id: 'title',
                  name: 'title',
                  autoComplete: 'title',
                  placeholder: 'Title',
                  disabled: false,
                  required: true,
                  width: 'full',
                  onChange: handleOnChange,
                  value: speakerData.title.value,
                  error: clickSubmit ? speakerData.title.error : '',
                },
                {
                  type: 'text',
                  label: 'Organization',
                  id: 'organization',
                  name: 'organization',
                  autoComplete: 'organization',
                  placeholder: 'Organization',
                  disabled: false,
                  required: true,
                  width: 'full',
                  onChange: handleOnChange,
                  value: speakerData.organization.value,
                  error: clickSubmit ? speakerData.organization.error : '',
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
                  value: speakerData.contact_email.value,
                  error: clickSubmit ? speakerData.contact_email.error : '',
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
                  value: speakerData.phone.value,
                  error: clickSubmit ? speakerData.phone.error : '',
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
                {
                  type: 'text',
                  label: 'Date of Event',
                  id: 'date',
                  name: 'date',
                  autoComplete: 'date',
                  placeholder: 'Date of Event (DD/MM/YYYY or DD-MM-YYYY)',
                  disabled: false,
                  required: true,
                  width: 'full',
                  onChange: handleOnChange,
                  value: speakerData.date.value,
                  error: clickSubmit ? speakerData.date.error : '',
                },
                {
                  type: 'text',
                  label: 'Type of Event',
                  id: 'type',
                  name: 'type',
                  autoComplete: 'type',
                  placeholder: 'Type of Event',
                  disabled: false,
                  required: true,
                  width: 'full',
                  onChange: handleOnChange,
                  value: speakerData.type.value,
                  error: clickSubmit ? speakerData.type.error : '',
                },
                {
                  type: 'text',
                  label: 'Event Location',
                  id: 'location',
                  name: 'location',
                  autoComplete: 'location',
                  placeholder: 'Event Location',
                  disabled: false,
                  required: true,
                  width: 'full',
                  onChange: handleOnChange,
                  value: speakerData.location.value,
                  error: clickSubmit ? speakerData.location.error : '',
                },
              ]}
            />
          </div>
        </div>
      )}
      {openSuccess && (
        <Success
          open={openSuccess}
          request={true}
          closeProp={() => {
            setOpenSuccess(false)
            setOpen(false)
          }}
        />
      )}
    </>
  )
}

export default SpeakerForm
