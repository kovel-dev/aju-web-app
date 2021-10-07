import { useState, useEffect } from 'react'

import {
  Meta,
  Footer,
  MailingList,
  Navbar,
  Heading,
  Tabs,
  FormTemplate,
  UseForm,
  Sponsorship,
} from 'components'
import Success from 'components/popup/success'
import SponsorRequest from 'lib/models/sponsor-request'
import meta from 'constants/meta'

export default function Donate() {
  const [activeTab, setActiveTab] = useState(0)
  // const [userInput, setUserInput] = useState({})
  const [clickSubmit, setClickSubmit] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [refreshNum, setRefreshNum] = useState(1)
  // const [isLoading, setIsLoading] = useState(false)

  const updateTab = (newTab) => {
    setActiveTab(newTab)
  }

  const updateUserInput = (newUserInput) => {
    if (newUserInput) {
      for (const key in newUserInput) {
        updateSingleInput({ key: key, value: newUserInput[key] })
      }
    }
  }

  const closePopup = () => {
    setOpenSuccess(false)
  }

  const contactSchema = {
    name: { value: '', error: 'Name field is required.' },
    phone: { value: '', error: '' },
    contact_email: { value: '', error: 'Email field is required.' },
    prefer_phone: { value: false, error: '' },
    tier: { value: '', error: 'Tier field is required.' },
    details: { value: '', error: 'Details field is required.' },
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
    tier: {
      required: true,
    },
    details: {
      required: true,
      validator: {
        regEx: /.*/i,
        error: 'Details field is required.',
      },
      minLength: 25,
      maxLength: 3000,
      multiWord: true,
    },
  }

  const submitForm = async () => {
    // reset the sponsorData inside the UseForm
    let model = new SponsorRequest({
      name: sponsorData.name.value,
      email: sponsorData.contact_email.value,
      mobile_number: sponsorData.phone.value,
      method_of_contact_phone: sponsorData.prefer_phone.value,
      tier: sponsorData.tier.value,
      details: sponsorData.details.value,
    })

    await model
      .save()
      .then(() => {
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
          if (key == 'mobile_number') {
            key = 'phone'
          } else if (key == 'method_of_contact_phone') {
            key = 'prefer_phone'
          } else if (key == 'email') {
            key = 'contact_email'
          }
          let errorMsg = item.values

          const data = sponsorData[key]

          formattedError.push({
            key: key,
            value: { value: data.value, error: errorMsg },
          })
        }

        handleBEerror(formattedError)
      })
  }

  const {
    formData: sponsorData,
    handleOnChange,
    handleOnSubmit,
    handleReset,
    handleBEerror,
    updateSingleInput,
  } = UseForm(contactSchema, contactValidationSchema, submitForm)

  useEffect(() => {
    let hasError = false
    for (const key in sponsorData) {
      const item = key.split('_').join('-')
      let itemHasError =
        sponsorData[key].value.length > 0 && sponsorData[key].error

      if (itemHasError) {
        hasError = true
        document.getElementById(item).classList.add('error')
      } else if (document.getElementById(item) && !itemHasError) {
        document.getElementById(item).classList.remove('error')
      }
    }
    setClickSubmit(hasError)
  }, [sponsorData])

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.donate.title}
        keywords={meta.donate.keywords}
        description={meta.donate.description}
      />

      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <Heading
          heading="Support Maven"
          breadcrumbs={[
            {
              link: '/',
              label: 'Home',
            },
            {
              link: '/donate',
              label: 'Donate',
            },
          ]}
        />
        <p className="px-5 mx-auto mb-4 text-sm leading-6 text-center max-w-wrapper sm:text-base">
          By making a donation today, you support bringing Jewish wisdom to the
          world. AJU is dedicated to offering digital and in-person learning
          that captures and delivers the insights of our faculty and friends,
          and convenes our diverse, inclusive community to advance ideas,
          dialogue, and debate.
        </p>
        <p className="px-5 mx-auto mb-4 text-sm leading-6 text-center max-w-wrapper sm:text-base">
          Sponsoring a program allows you to reach our proprietary audience of
          over worldwide 50,000 users.  For organizations, your brand will be
          visible to this highly specialized audience, raising the profile of
          your community.  As an individual sponsor, your sponsorship allows us
          to continue delivering specialized content while bringing Jewish
          wisdom to the world.  
        </p>
        <p className="px-5 mx-auto mb-4 text-sm leading-6 text-center max-w-wrapper sm:text-base">
          Complete this form and a member of our team will be touch with you to
          complete your sponsorship.
        </p>
        <p className="px-5 mx-auto mb-12 text-sm leading-6 text-center max-w-wrapper sm:text-base">
          If you would like information about making a special gift, please
          contact us at{' '}
          <a href="mailto:advancement@aju.edu">advancement@aju.edu</a>.
        </p>
        <Tabs
          tabs={['Make a Donation', 'Become a Sponsor']}
          updateTabProp={updateTab}
        />
        <div
          className={`max-w-wrapper mx-auto sm:pb-12 md:pb-20 md:mt-12 ${
            activeTab === 0 ? '' : 'hidden'
          }`}
        >
          <div className="px-5 py-12 mx-auto callout-shadow md:w-4/5 md:px-0">
            <script src="https://embed.idonate.com/idonate.js"></script>
            <div data-idonate-embed="34985c21-e68e-40c5-be12-03a55edfa673"></div>
          </div>
        </div>
        {activeTab === 1 && (
          <div className="pb-20 mx-auto max-w-wrapper sm:pb-12 sm:px-5">
            <Sponsorship
              tiers={[
                {
                  description: 'Sponsoring a Program Series',
                  price: 540,
                },
                {
                  description: 'Sponsoring a Single Event',
                  price: 1000,
                },
                {
                  description: 'Sponsoring a VIP Event',
                  price: 1800,
                },
              ]}
            />
            <div className="flex items-center justify-center mx-auto mt-7 max-w-form">
              <FormTemplate
                key={refreshNum}
                updateUserInputProp={updateUserInput}
                submitContent="Send Message"
                onSubmitProp={(e) => {
                  e.preventDefault()
                  handleOnSubmit(e)
                  setClickSubmit(true)
                }}
                schema={[
                  {
                    type: 'heading',
                    heading: 'Sponsorship Request Form',
                  },
                  {
                    type: 'text',
                    label: 'Name',
                    id: 'name',
                    name: 'name',
                    autoComplete: 'name',
                    placeholder: 'Name*',
                    disabled: false,
                    required: true,
                    width: 'xl',
                    onChange: handleOnChange,
                    value: sponsorData.name.value,
                    error: clickSubmit ? sponsorData.name.error : '',
                  },
                  {
                    type: 'email',
                    label: 'Email',
                    id: 'contact-email',
                    name: 'contact_email',
                    autoComplete: '',
                    placeholder: 'Email*',
                    disabled: false,
                    required: true,
                    width: 'xl',
                    onChange: handleOnChange,
                    value: sponsorData.contact_email.value,
                    error: clickSubmit ? sponsorData.contact_email.error : '',
                  },
                  {
                    type: 'phone',
                    id: 'phone',
                    name: 'phone',
                    autoComplete: '',
                    placeholder: 'Mobile Number',
                    disabled: false,
                    required: false,
                    width: 'xl',
                    onChange: handleOnChange,
                    value: sponsorData.phone.value,
                    error: clickSubmit ? sponsorData.phone.error : '',
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
                        value: true,
                      },
                    ],
                  },
                  {
                    type: 'select',
                    label: 'Please select a sponsorship opportunity',
                    placeholder: 'Select Opportunity',
                    name: 'tier',
                    id: 'tier',
                    options: [
                      { key: '', value: 'Select a Sponsorship Opportunity' },
                      { key: 'program-series', value: 'Program Series' },
                      { key: 'single-event', value: 'Single Event' },
                      { key: 'vip-event', value: 'VIP Event' },
                    ],
                    width: 'xl',
                    onChange: handleOnChange,
                    value: sponsorData.tier.value,
                    error: clickSubmit ? sponsorData.tier.error : '',
                  },
                  {
                    type: 'textarea',
                    label: 'Details',
                    id: 'details',
                    instructions: '',
                    name: 'details',
                    autoComplete: '',
                    placeholder:
                      'Provide details about your sponsorship request',
                    disabled: false,
                    required: true,
                    rows: 10,
                    onChange: handleOnChange,
                    value: sponsorData.details.value,
                    error: clickSubmit ? sponsorData.details.error : '',
                  },
                ]}
              />
            </div>
          </div>
        )}
        {openSuccess && <Success open={openSuccess} closeProp={closePopup} />}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}
