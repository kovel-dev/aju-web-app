import { useState, useEffect } from 'react'

import {
  Meta,
  Footer,
  MailingList,
  Navbar,
  Heading,
  FormTemplate,
  UseForm,
} from 'components'
import Success from 'components/popup/success'
import ConctactFormSchema from 'lib/schemas/contact-form-schema'
import ConctactFormValidation from 'lib/validations/contact-form-validations'
import Contact from 'lib/models/contact'
import meta from 'constants/meta'

export default function ContactForm() {
  const [userInput, setUserInput] = useState({})
  const [clickSubmit, setClickSubmit] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const contactValidationSchema = ConctactFormValidation.getSchema()
  const contactSchema = Contact.getSchema()

  // Update prefer phone value
  useEffect(() => {
    if (userInput.i_prefer_to_be_contacted_by_phone) {
      if (userInput.i_prefer_to_be_contacted_by_phone.length) {
        contactData.prefer_phone.value = true
      } else {
        contactData.prefer_phone.value = false
      }
    }
  }, [userInput])

  // function to submit form
  const submitForm = async () => {
    setIsLoading(true)
    // get all the key/value pair to attach to the model
    let contact = new Contact({
      name: contactData.name.value,
      email: contactData.contact_email.value,
      mobile_number: contactData.phone.value,
      method_of_contact_phone: contactData.prefer_phone.value,
      message: contactData.message.value,
    })

    try {
      await contact.save().then(() => {
        setIsLoading(false)

        // open success message
        setOpenSuccess(true)
      })
    } catch (error) {
      setIsLoading(false)
    }
  }

  // form validation
  const {
    formData: contactData,
    handleOnChange,
    handleOnSubmit,
  } = UseForm(contactSchema, contactValidationSchema, submitForm)

  // update html field class when error
  useEffect(() => {
    if (clickSubmit) {
      for (const key in contactData) {
        const item = key.split('_').join('-')
        if (contactData[key].error) {
          document.getElementById(item).classList.add('error')
        } else {
          document.getElementById(item).classList.remove('error')
        }
      }
    }
  }, [contactData, clickSubmit])

  // function to close modal
  const closePopup = () => {
    setOpenSuccess(false)
    for (const key in contactData) {
      contactData[key].value = ''
    }

    setClickSubmit(false)

    const formId = ['name', 'contact-email', 'phone', 'message']
    formId.forEach((id) => {
      const target = document.getElementById(id)
      if (target) {
        target.value = ''
      }
    })

    document.getElementById('prefer-phone').checked = false
    setTimeout(function () {
      document.getElementById('phone').value = ''
    }, 100)
  }

  // function to grab updates from the templated form
  const updateUserInput = (newUserInput) => {
    setUserInput(newUserInput)
  }

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.contact.title}
        keywords={meta.contact.keywords}
        description={meta.contact.description}
      />

      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <Heading
          heading="Get in Touch"
          breadcrumbs={[
            {
              link: '/',
              label: 'Home',
            },
            {
              link: '/contact',
              label: 'Contact',
            },
          ]}
        />
        <p className="px-5 mx-auto mb-4 text-sm leading-6 text-center max-w-wrapper sm:text-base">
          Connect with us today.
        </p>
        <p className="px-5 mx-auto mb-10 text-sm leading-6 text-center max-w-wrapper sm:text-base lg:mb-16">
          Let us know a little about what you need in the form below, and we
          will get back to you as soon as we can.
        </p>
        <div className="flex flex-col-reverse mx-auto max-w-wrapper lg:px-5 lg:flex-row">
          <FormTemplate
            updateUserInputProp={updateUserInput}
            submitContent={isLoading ? 'Sending...' : 'Send Message'}
            onSubmitProp={(e) => {
              e.preventDefault()
              handleOnSubmit(e)
              setClickSubmit(true)
            }}
            schema={ConctactFormSchema.getSchema(
              handleOnChange,
              contactData,
              clickSubmit,
              isLoading
            )}
          />
          <div className="flex flex-col px-5 space-y-6 lg:w-1/2 lg:pl-12 sm:min-w-info lg:px-0">
            <div className="flex icon-container">
              <div className="flex items-center justify-center flex-shrink-0 rounded-sm img-container bg-blue-850 h-9 w-9 mr-7">
                <img
                  src="/images/map-marker.png"
                  alt="map marker icon"
                  className="w-auto h-5"
                />
              </div>
              <p className="self-center font-bold leading-6 text-blue-850 lg:text-lg">
                15600 Mulholland Drive
                <br />
                Los Angeles, CA 90077
              </p>
            </div>
            <div className="flex icon-container">
              <div className="flex items-center justify-center flex-shrink-0 rounded-sm img-container bg-blue-850 h-9 w-9 mr-7">
                <img
                  src="/images/email.png"
                  alt="map marker icon"
                  className="w-auto h-5"
                />
              </div>
              <a
                className="self-center font-bold leading-6 text-blue-850 lg:text-lg"
                href="mailto:mavensupport@aju.edu"
              >
                mavensupport@aju.edu
              </a>
            </div>
          </div>
        </div>
        {openSuccess && <Success open={openSuccess} closeProp={closePopup} />}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}
