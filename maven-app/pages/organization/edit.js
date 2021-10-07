import { getSession } from 'next-auth/client'
import { server } from '../../lib/config/server'
import { useEffect, useState } from 'react'
import EditOrganizationFormSchema from 'lib/schemas/organization-form-edit-schema'
import Head from 'next/head'
import Link from 'next/link'
import FormTemplate2Cols from '../../components/form/formTemplate2Cols'
import OrganizationForm from 'lib/models/organization-form'
import Footer from '../../components/footer'
import MailingList from '../../components/mailingList'
import SuccessProfilePopup from '../../components/popup/success-profile'
import jwt from 'next-auth/jwt'
import Heading from '@components/heading'
import Navbar from '@components/navbar'

// check user authentication before accessing this page
export async function getServerSideProps(context) {
  // session
  const session = await getSession({ req: context.req })

  // if role is not partner redirect to partner dashboard
  if (session.user.role !== 'partner') {
    return {
      redirect: {
        destination: `${server}/individual/dashboard`,
        permanent: false,
      },
    }
  }

  // get request token
  let payLoad = await jwt.getToken({
    req: context.req,
    secret: process.env.JWT_SECRET,
  })

  // encode token
  let apiToken = await jwt.encode({
    token: payLoad,
    secret: process.env.JWT_SECRET,
  })

  return {
    // set session and token
    props: { session, apiToken, payLoad },
  }
}

// the actual page
function EditOrganizationProfilePage(props) {
  let organization = new OrganizationForm({})
  const [modelState, setModelState] = useState(organization.getValues(true))
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [schema, setSchema] = useState([{}])
  const [isEditMode, setEditModeState] = useState(true)

  // get organization/partner after page load
  useEffect(async () => {
    setIsLoading(true)
    // set schema
    setSchema(await EditOrganizationFormSchema.getSchema(isEditMode, true))
    setIsLoading(false)

    // get current organization/partner
    getCurrentPartner()
  }, [])

  // get current organization/partner process
  const getCurrentPartner = async () => {
    setIsLoading(true)

    // get organization/partner profile
    let modelRes = null
    try {
      await organization
        .getPartnerProfile(props.payLoad.userRefID, props.apiToken)
        .then((response) => {
          modelRes = response
        })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }

    if (modelRes) {
      // initialize response data to organization/partner model to format data
      organization = new OrganizationForm(modelRes.data)

      document.getElementById('is_subscribe').checked =
        organization.is_subscribe == 'yes'

      // set organization/partner data to modelState
      setModelState(organization.getValues(true))
      setIsLoading(false)
    }
  }

  // method to close the success modal
  const closePopup = (remove) => {
    setOpenSuccess(false)
  }

  // method to change modes edit/update
  const editModeHandler = async (status) => {
    setSchema(await EditOrganizationFormSchema.getSchema(status, true))
    getCurrentPartner()
    setEditModeState(status)
  }

  // method to submit form
  const submitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})

    organization = new OrganizationForm(modelState)
    try {
      await organization
        .update(props.payLoad.userRefID, props.apiToken)
        .then(async (response) => {
          setIsLoading(false)
          setErrors({})

          // put back to edit mode
          editModeHandler(true)

          // open success message
          setOpenSuccess(true)
        })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <title>Edit Partner Profile</title>
        <meta name="description" content="Login" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <header className="w-full">
        <Navbar />
      </header>
      <main className="min-h-screen px-4 sm:px-0 lg:pb-16 pb-11">
        <div className="sm:px-5 mx-auto max-w-wrapper">
          <Heading heading={'Profile'} />
          <FormTemplate2Cols
            formSchema={schema}
            formSubmit={submitHandler}
            formSubmitLabel={isEditMode ? 'Edit' : 'Save Changes'}
            formIsLoading={isLoading}
            fieldValues={modelState}
            fieldValuesHandler={setModelState}
            isEditMode={isEditMode}
            isEditPage={true}
            isEditHandler={() => editModeHandler(false)}
            errors={errors}
          />
        </div>
        {openSuccess && (
          <SuccessProfilePopup open={openSuccess} closeProp={closePopup} />
        )}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default EditOrganizationProfilePage
EditOrganizationProfilePage.auth = true
