import {
  Button,
  Card,
  Footer,
  Heading,
  Layout,
  MailingList,
  Navbar,
  Typography,
} from '@components'
import Link from 'next/link'
import OrganizationForm from 'lib/models/organization-form'
import CardContainer from '@components/blocks/cardContainer'
import jwt from 'next-auth/jwt'
import Loader from '@components/loader'
import PartnerForm from '@components/form/partnerForm'
import Page from 'lib/models/pages'
import { useEffect, useState } from 'react'
import { getSession } from 'next-auth/client'
import { server } from '../../lib/config/server'
import { useRouter } from 'next/router'
import { Meta } from '../../components'
import meta from '../../constants/meta'

export async function getServerSideProps(context) {
  // session
  const session = await getSession({ req: context.req })

  // if role is not partner redirect to partner dashboard
  if (session.user.role !== 'partner') {
    return {
      redirect: {
        // eslint-disable-next-line no-undef
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

const OrganizationHome = (props) => {
  let organization = new OrganizationForm({})
  const [modelState, setModelState] = useState(organization.getValues(true))
  const [partnerForm, setPartnerForm] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProgram, setIsLoadingProgram] = useState(false)
  const [programs, setPrograms] = useState([])
  let router = useRouter()

  // get organization/partner after page load
  useEffect(async () => {
    // get current organization/partner
    getCurrentPartner()
    getEarlyAccessProgrammingData()
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

      // set organization/partner data to modelState
      setModelState(organization.getValues(true))
      setIsLoading(false)
    }
  }

  const getEarlyAccessProgrammingData = async () => {
    setIsLoadingProgram(true)

    try {
      await Page.getEarlyAccessPrograms().then((result) => {
        setPrograms(result.data)
        setIsLoadingProgram(false)
      })
    } catch (error) {
      setErrors(error)
      setIsLoadingProgram(false)
    }
  }

  const doMore = [
    {
      title: 'Design a Customized Program with our Team',
      // description:
      //   'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia.',
      link: '/suggestion',
    },
    {
      title: 'Sponsor a Program',
      // description:
      //   'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia.',
      link: '/donate',
    },
    {
      title: 'Book an AJU Team Member for a Private Event',
      // description:
      //   'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia.',
      link: '/events-classes/book-speaker',
    },
  ]

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.organization.title}
        keywords={meta.organization.keywords}
        description={meta.organization.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main className="pb-16">
        {isLoading && (
          <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
            <Loader />
          </div>
        )}
        {!isLoading && (
          <>
            <Heading heading={'Hello, ' + modelState.org_name} />

            <div className="pt-9 lg:pt-28 max-w-wrapper mx-auto">
              <Typography
                variant="subheading-2"
                className="mb-6 text-center lg:mb-14"
              >
                Welcome to Early Access Programming
              </Typography>
              {isLoadingProgram && (
                <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
                  <Loader />
                </div>
              )}
              {/* {!isLoadingProgram && programs.length <= 0 && (
                <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
                  <p className="text-center text-blue-850">
                    No Record(s) Found.
                  </p>
                </div>
              )} */}
              {!isLoadingProgram && programs.length > 0 && (
                <>
                  <CardContainer schema={programs} />
                  <div className="mb-16 text-center">
                    <Button
                      buttonStyle="gray-outline"
                      type="button"
                      buttonContent="View All"
                      className="font-bold"
                      width="auto"
                      action={() => {
                        router.push(
                          '/organization/my-schedule-marketing-materials'
                        )
                      }}
                    />
                  </div>
                </>
              )}
              <Typography variant="subheading" className="mb-12 text-center">
                Do More with Maven
              </Typography>
              <div className="block lg:flex mb-14 px-5 lg:space-x-12">
                {doMore.map((value, valueIndex) => (
                  <Card
                    className={`px-6 pt-10 pb-16 mb-6 lg:mb-0 lg:w-1/3 ${
                      value.description ? '' : 'flex flex-col justify-between'
                    }`}
                    key={valueIndex}
                  >
                    <Typography
                      variant="subheading-2"
                      className="uppercase mb-6"
                    >
                      {value.title}
                    </Typography>
                    <Typography className="mb-7">
                      {value.description}
                    </Typography>
                    <a
                      onClick={
                        !value.link
                          ? () => {
                              setPartnerForm(true)
                              window.scrollTo(0, 30)
                            }
                          : () => {}
                      }
                      href={value.link ? value.link : ''}
                    >
                      <Typography className="underline">Learn More</Typography>
                    </a>
                  </Card>
                ))}
              </div>
              <div className="px-5">
                <div className="flex flex-col items-center justify-center py-16 bg-gray-200 mb-11 lg:mb-16 px-5 lg:px-20 gap-7 lg:flex-row">
                  <Typography variant="subheading-2">
                    We want to hear your program ideas,{' '}
                    <span className="md:whitespace-nowrap">
                      submit a suggestion now!
                    </span>
                  </Typography>
                  <Link href="/suggestion">
                    <a className="bg-white border-4 border-blue-850 text-blue-850 py-2.5 px-6 font-bold flex-shrink-0 hover:opacity-80 text-xl">
                      Submit Suggestion
                    </a>
                  </Link>
                </div>
              </div>
              <div className="max-w-title mx-auto px-5 lg:px-0">
                <Typography variant="subheading" className="mb-10 text-center">
                  Get access to analytics and resources to enhance your members
                  learning experience
                </Typography>
              </div>
              <div className="flex flex-col space-y-5 md:space-y-0 text-center md:space-x-12 lg:space-x-16 md:flex-row lg:mx-28 md:mx-10 justify-center px-5 lg:px-0">
                <Link href="/organization/my-analytics">
                  <a className="bg-blue-850 text-white text-center py-4 px-6 font-bold flex items-center justify-center hover:opacity-80">
                    My Analytics and Schedule
                  </a>
                </Link>
                <Link href="/organization/my-schedule-marketing-materials">
                  <a className="bg-blue-850 text-white text-center p-4 font-bold md:w-5/12 lg:w-4/12 md:flex items-center justify-center flex-col hover:opacity-80">
                    Early Access Programing{' '}
                    <span className="whitespace-nowrap">
                      and Marketing Materials
                    </span>
                  </a>
                </Link>
                <Link href="/organization/edit">
                  <a className="bg-blue-850 text-white text-center py-4 px-6 font-bold flex items-center justify-center hover:opacity-80">
                    Edit My Profile
                  </a>
                </Link>
              </div>
            </div>
          </>
        )}
        {partnerForm && <PartnerForm closeProp={() => setPartnerForm(false)} />}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default OrganizationHome
OrganizationHome.auth = true
