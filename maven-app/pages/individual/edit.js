import { getSession } from 'next-auth/client'
import { server } from '../../lib/config/server'
import { useEffect, useState } from 'react'
import EditIndividualFormSchema from 'lib/schemas/individual-form-edit-schema'
import Head from 'next/head'
import Link from 'next/link'
import FormTemplate2Cols from '../../components/form/formTemplate2Cols'
import User from 'lib/models/user'
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

  // if role is not student redirect to student dashboard
  if (session.user.role !== 'student') {
    return {
      redirect: {
        destination: `${server}/organization/dashboard`,
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
function EditIndividualProfilePage(props) {
  let user = new User({})
  const [userState, setUserState] = useState(user.getValues(true))
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [schema, setSchema] = useState([{}])
  const [isEditMode, setEditModeState] = useState(true)

  // get user after page load
  useEffect(async () => {
    setIsLoading(true)
    // set schema
    setSchema(await EditIndividualFormSchema.getSchema(isEditMode, true))
    setIsLoading(false)

    // get current user
    getCurrentUser()
  }, [])

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

      document.getElementById('is_subscribe').checked =
        user.is_subscribe == 'yes'

      // set user data to userState
      setUserState(user.getValues(true))
      setIsLoading(false)
    }
  }

  const closePopup = (remove) => {
    setOpenSuccess(false)
  }

  const editModeHandler = async (status) => {
    setSchema(await EditIndividualFormSchema.getSchema(status, true))
    getCurrentUser()
    setEditModeState(status)
  }

  const submitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})

    user = new User(userState)
    try {
      await user
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
        <title>Edit Individual Profile</title>
        <meta name="description" content="Login" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <header className="w-full">
        <Navbar />
      </header>
      <main className="min-h-screen px-4 sm:px-0 lg:pb-16 pb-11">
        <div className="sm:px-5 mx-auto max-w-wrapper">
          <Heading
            heading={
              userState.first_name + ' ' + userState.last_name + ' Profile'
            }
          />
          <FormTemplate2Cols
            formSchema={schema}
            formSubmit={submitHandler}
            formSubmitLabel={isEditMode ? 'Edit' : 'Save Changes'}
            formIsLoading={isLoading}
            fieldValues={userState}
            fieldValuesHandler={setUserState}
            isEditMode={isEditMode}
            isEditPage={true}
            isEditHandler={() => editModeHandler(false)}
            errors={errors}
            individual={true}
            editIndividual={true}
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

export default EditIndividualProfilePage
EditIndividualProfilePage.auth = true
