import Footer from '../components/footer'
import MailingList from '../components/mailingList'
import Navbar from '../components/navbar'
import Heading from '../components/heading'
import { useState, useEffect } from 'react'
import FormTemplate from '../components/form/formTemplate'
import UseForm from '../components/form/UseForm'
import Success from '../components/popup/success'
import Meta from '@components/meta'
import meta from 'constants/meta'
import Suggestion from 'lib/models/suggestion'

export default function SuggestionPage() {
  const [userInput, setUserInput] = useState({})
  const [clickSubmit, setClickSubmit] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [refreshNum, setRefreshNum] = useState(1)

  const updateUserInput = (newUserInput) => {
    if (newUserInput) {
      for (const key in newUserInput) {
        updateSingleInput({ key: key, value: newUserInput[key] })
      }
    }
  }

  useEffect(() => {
    if (userInput.i_prefer_to_be_contacted_by_phone) {
      if (userInput.i_prefer_to_be_contacted_by_phone.length) {
        suggestionData.prefer_phone.value = true
      } else {
        suggestionData.prefer_phone.value = false
      }
    }
  }, [userInput])

  const closePopup = (remove) => {
    setOpenSuccess(false)
  }

  const contactSchema = {
    name: { value: '', error: 'Name field is required.' },
    phone: { value: '', error: '' },
    contact_email: { value: '', error: 'Email field is required.' },
    prefer_phone: { value: false, error: '' },
    type: { value: '', error: 'Suggestion Type is required.' },
    details: { value: '', error: 'Additional Details field is required.' },
  }

  const contactValidationSchema = {
    name: {
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
    type: {
      required: true,
      error: '',
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
  }

  const submitForm = async () => {
    let model = new Suggestion({
      name: suggestionData.name.value,
      contact_email: suggestionData.contact_email.value,
      phone: suggestionData.phone.value,
      prefer_phone: suggestionData.prefer_phone.value,
      type: suggestionData.type.value,
      details: suggestionData.details.value,
    })

    await model
      .save()
      .then((response) => {
        // open success message
        setOpenSuccess(true)
        handleReset()

        // increment the number for force the template component to re-render
        setRefreshNum(parseInt(refreshNum) + 1)
        setClickSubmit(true)
      })
      .catch((error) => {
        let formattedError = []
        for (let index = 0; index < error.length; index++) {
          const item = error[index]

          let key = item.key
          let errorMsg = item.values
          const data = suggestionData[key]

          formattedError.push({
            key: key,
            value: { value: data.value, error: errorMsg },
          })
        }

        handleBEerror(formattedError)
        setClickSubmit(true)
      })
  }

  const {
    formData: suggestionData,
    handleOnChange,
    handleOnSubmit,
    handleReset,
    handleBEerror,
    updateSingleInput,
  } = UseForm(contactSchema, contactValidationSchema, submitForm)

  useEffect(() => {
    let hasError = false
    for (const key in suggestionData) {
      const item = key.split('_').join('-')
      let itemHasError =
        suggestionData[key].value.length > 0 && suggestionData[key].error

      if (itemHasError) {
        hasError = true
        document.getElementById(item).classList.add('error')
      } else if (document.getElementById(item) && !itemHasError) {
        document.getElementById(item).classList.remove('error')
      }
    }
    setClickSubmit(hasError)
  }, [suggestionData])

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.suggestion.title}
        keywords={meta.suggestion.keywords}
        description={meta.suggestion.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <Heading heading="Submit a Suggestion" />
        <p className="text-center max-w-wrapper mx-auto px-5 leading-6 sm:text-base text-sm lg:mb-16 mb-4">
          Do you have a suggestion for future classes, events and/or speakers?
        </p>
        <div className="max-w-suggestion mx-auto lg:px-5 lg:pb-20">
          <FormTemplate
            updateUserInputProp={updateUserInput}
            suggestion={true}
            submitContent="Submit"
            onSubmitProp={(e) => {
              e.preventDefault()
              handleOnSubmit(e)
              setClickSubmit(true)
            }}
            schema={[
              {
                type: 'heading',
                heading: 'Suggestion Form',
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
                value: suggestionData.name.value,
                error: clickSubmit ? suggestionData.name.error : '',
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
                value: suggestionData.contact_email.value,
                error: clickSubmit ? suggestionData.contact_email.error : '',
              },
              {
                type: 'phone',
                id: 'phone',
                name: 'phone',
                autoComplete: '',
                placeholder: 'Phone Number',
                disabled: false,
                required: false,
                width: 'full',
                onChange: handleOnChange,
                value: suggestionData.phone.value,
                error: clickSubmit ? suggestionData.phone.error : '',
              },
              {
                type: 'checkbox',
                label: 'I prefer to be contacted by phone',
                id: 'prefer-phone',
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
                type: 'select',
                label: '',
                id: 'type',
                name: 'type',
                onChange: handleOnChange,
                value: suggestionData.type.value,
                error: clickSubmit ? suggestionData.type.error : '',
                options: [
                  {
                    key: '',
                    value: 'Select suggestion',
                  },
                  {
                    key: 'topic',
                    value: 'Suggest topic for a program',
                  },
                  {
                    key: 'speaker',
                    value: 'Suggest speaker for a program',
                  },
                  {
                    key: 'topic-speaker',
                    value: 'Suggest a topic and speaker for a program',
                  },
                ],
                width: 'full',
                placeholder: 'Suggestion Type',
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
                value: suggestionData.details.value,
                error: clickSubmit ? suggestionData.details.error : '',
              },
            ]}
          />
        </div>
        {openSuccess && (
          <Success
            open={openSuccess}
            closeProp={closePopup}
            icon="/images/success-check.png"
            title="Your suggestion has been submitted"
            description="A member of our team will be in touch regarding your suggestion."
            check={true}
          />
        )}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}
