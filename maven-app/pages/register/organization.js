import { getSession } from 'next-auth/client'
import { server } from '../../lib/config/server'
import { useEffect, useState } from 'react'
import OrganizationFormSchema from 'lib/schemas/organization-form-schema'
import Head from 'next/head'
import Link from 'next/link'
import FormTemplate2Cols from '../../components/form/formTemplate2Cols'
import OrganizationForm from 'lib/models/organization-form'
import Footer from '../../components/footer'
import MailingList from '../../components/mailingList'
import Success from '../../components/popup/success'

// check user authentication before accessing this page
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (session) {
    return {
      redirect: {
        destination: `${server}/`,
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

// the actual page
export default function RegisterIndividualPage() {
  let orgForm = new OrganizationForm({})
  const [modalState, setModelState] = useState(orgForm.getValues())
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [schema, setSchema] = useState([{}])

  useEffect(async () => {
    setIsLoading(true)
    setSchema(await OrganizationFormSchema.getSchema())
    setIsLoading(false)
  }, [])

  const closePopup = (remove) => {
    setOpenSuccess(false)
  }

  const submitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})

    let orgForm = new OrganizationForm(modalState)
    try {
      await orgForm.save().then((response) => {
        setIsLoading(false)
        setErrors({})

        // reset fields
        orgForm = new OrganizationForm({})
        setModelState(orgForm.getValues())

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
        <title>Register</title>
        <meta name="description" content="Login" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="min-h-screen px-4 pt-16 lg:pt-20 sm:px-0 lg:pb-16 pb-11">
        <Link href="/">
          <a>
            <img
              src="/images/maven_logo2.png"
              alt="Maven logo"
              className="w-auto mx-auto h-14 sm:h-16"
            />
          </a>
        </Link>
        <div className="sm:px-5 mx-auto max-w-wrapper lg:mt-16 mt-10">
          <FormTemplate2Cols
            formSchema={schema}
            formSubmit={submitHandler}
            formSubmitLabel="Register"
            formIsLoading={isLoading}
            fieldValues={modalState}
            fieldValuesHandler={setModelState}
            errors={errors}
            individual={false}
          />
        </div>
        {openSuccess && (
          <Success
            check={true}
            title="Your registration form has been submitted"
            description="A member of our team will be in touch to confirm your registration."
            open={openSuccess}
            closeProp={closePopup}
            icon="/images/success-check.png"
            request={false}
          />
        )}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}
