import {
  Accordion,
  Button,
  Footer,
  Heading,
  Layout,
  MailingList,
  Meta,
  Navbar,
  Typography,
} from 'components'
import {
  convertToRaw,
  convertFromRaw,
  convertFromHTML,
  EditorState,
  ContentState,
} from 'draft-js'
import { useEffect, useState } from 'react'
import draftToHtml from 'draftjs-to-html'
import Loader from '@components/loader'
import meta from 'constants/meta'
import Page from 'lib/models/pages'

const breadcrumb = [
  {
    link: '/',
    label: 'Home',
  },
  {
    link: '/faq',
    label: 'Help',
  },
]

const Faq = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [faq, setFaq] = useState('')
  const [accountSetupData, setAccountSetupData] = useState([])
  const [forRegisteredUsersData, setForRegisteredUsersData] = useState([])
  const [paymentData, setPaymentData] = useState([])
  const [forRegisteredPartnersData, setForRegisteredPartnersData] = useState([])

  useEffect(async () => {
    getData()
  }, [])

  const getData = async () => {
    try {
      await Page.getFaqData().then((response) => {
        let responseData = response.data
        setFaq(responseData)

        if (
          responseData.accountSetupDetails &&
          responseData.accountSetupDetails.length > 0
        ) {
          let newDetails = responseData.accountSetupDetails.map(
            (item, index) => {
              let htmlQuestion = ''
              let htmlAnswer = ''
              let stateQuestion = ''
              let stateAnswer = ''
              try {
                stateQuestion = convertFromRaw(JSON.parse(item.question))
                stateAnswer = convertFromRaw(JSON.parse(item.answer))
              } catch {
                const questionBlocksFromHTML = convertFromHTML(
                  `<p>${item.question}<p>`
                )
                stateQuestion = ContentState.createFromBlockArray(
                  questionBlocksFromHTML.contentBlocks,
                  questionBlocksFromHTML.entityMap
                )

                const answerBlocksFromHTML = convertFromHTML(
                  `<p>${item.answer}<p>`
                )
                stateAnswer = ContentState.createFromBlockArray(
                  answerBlocksFromHTML.contentBlocks,
                  answerBlocksFromHTML.entityMap
                )
              }

              try {
                const rawQuestion = convertToRaw(stateQuestion)
                htmlQuestion = draftToHtml(rawQuestion)
                const rawAnswer = convertToRaw(stateAnswer)
                htmlAnswer = draftToHtml(rawAnswer)
              } catch (error) {
                console.log('error converting to html')
              }
              return { title: htmlQuestion, content: htmlAnswer }
            }
          )
          setAccountSetupData(newDetails)
        }

        if (
          responseData.registeredUsersDetails &&
          responseData.registeredUsersDetails.length > 0
        ) {
          let newDetails = responseData.registeredUsersDetails.map(
            (item, index) => {
              let htmlQuestion = ''
              let htmlAnswer = ''
              let stateQuestion = ''
              let stateAnswer = ''
              try {
                stateQuestion = convertFromRaw(JSON.parse(item.question))
                stateAnswer = convertFromRaw(JSON.parse(item.answer))
              } catch {
                const questionBlocksFromHTML = convertFromHTML(
                  `<p>${item.question}<p>`
                )
                stateQuestion = ContentState.createFromBlockArray(
                  questionBlocksFromHTML.contentBlocks,
                  questionBlocksFromHTML.entityMap
                )

                const answerBlocksFromHTML = convertFromHTML(
                  `<p>${item.answer}<p>`
                )
                stateAnswer = ContentState.createFromBlockArray(
                  answerBlocksFromHTML.contentBlocks,
                  answerBlocksFromHTML.entityMap
                )
              }

              try {
                const rawQuestion = convertToRaw(stateQuestion)
                htmlQuestion = draftToHtml(rawQuestion)
                const rawAnswer = convertToRaw(stateAnswer)
                htmlAnswer = draftToHtml(rawAnswer)
              } catch (error) {
                console.log('error converting to html')
              }
              return { title: htmlQuestion, content: htmlAnswer }
            }
          )
          setForRegisteredUsersData(newDetails)
        }

        if (
          responseData.paymentsDetails &&
          responseData.paymentsDetails.length > 0
        ) {
          let newDetails = responseData.paymentsDetails.map((item, index) => {
            let htmlQuestion = ''
            let htmlAnswer = ''
            let stateQuestion = ''
            let stateAnswer = ''
            try {
              stateQuestion = convertFromRaw(JSON.parse(item.question))
              stateAnswer = convertFromRaw(JSON.parse(item.answer))
            } catch {
              const questionBlocksFromHTML = convertFromHTML(
                `<p>${item.question}<p>`
              )
              stateQuestion = ContentState.createFromBlockArray(
                questionBlocksFromHTML.contentBlocks,
                questionBlocksFromHTML.entityMap
              )

              const answerBlocksFromHTML = convertFromHTML(
                `<p>${item.answer}<p>`
              )
              stateAnswer = ContentState.createFromBlockArray(
                answerBlocksFromHTML.contentBlocks,
                answerBlocksFromHTML.entityMap
              )
            }

            try {
              const rawQuestion = convertToRaw(stateQuestion)
              htmlQuestion = draftToHtml(rawQuestion)
              const rawAnswer = convertToRaw(stateAnswer)
              htmlAnswer = draftToHtml(rawAnswer)
            } catch (error) {
              console.log('error converting to html')
            }
            return { title: htmlQuestion, content: htmlAnswer }
          })
          setPaymentData(newDetails)
        }

        if (
          responseData.registeredPartnersDetails &&
          responseData.registeredPartnersDetails.length > 0
        ) {
          let newDetails = responseData.registeredPartnersDetails.map(
            (item, index) => {
              let htmlQuestion = ''
              let htmlAnswer = ''
              let stateQuestion = ''
              let stateAnswer = ''
              try {
                stateQuestion = convertFromRaw(JSON.parse(item.question))
                stateAnswer = convertFromRaw(JSON.parse(item.answer))
              } catch {
                const questionBlocksFromHTML = convertFromHTML(
                  `<p>${item.question}<p>`
                )
                stateQuestion = ContentState.createFromBlockArray(
                  questionBlocksFromHTML.contentBlocks,
                  questionBlocksFromHTML.entityMap
                )

                const answerBlocksFromHTML = convertFromHTML(
                  `<p>${item.answer}<p>`
                )
                stateAnswer = ContentState.createFromBlockArray(
                  answerBlocksFromHTML.contentBlocks,
                  answerBlocksFromHTML.entityMap
                )
              }

              try {
                const rawQuestion = convertToRaw(stateQuestion)
                htmlQuestion = draftToHtml(rawQuestion)
                const rawAnswer = convertToRaw(stateAnswer)
                htmlAnswer = draftToHtml(rawAnswer)
              } catch (error) {
                console.log('error converting to html')
              }
              return { title: htmlQuestion, content: htmlAnswer }
            }
          )
          setForRegisteredPartnersData(newDetails)
        }

        setIsLoading(false)
      })
    } catch (error) {
      setHasError(true)
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-fullpage">
      <Meta
        title={faq.title}
        keywords={meta.faq.keywords}
        description={faq.description}
        image={faq.bannerImage}
      />
      <header className="w-full">
        <Navbar />
      </header>
      {isLoading && <Loader />}
      {!isLoading && hasError && (
        <div className="w-full my-10">
          <div className="justify-center mx-auto max-w-wrapper">
            <p className="text-center text-red-600">
              Ops! Sorry something went wrong getting the result.
            </p>
          </div>
        </div>
      )}
      {!isLoading && (
        <>
          <main>
            <Heading heading={faq.title} breadcrumbs={breadcrumb} />
            <div className="mt-6 mb-8 lg:mb-12 max-h-banner overflow-hidden">
              <img
                src={faq.bannerImage}
                alt="customer suppport image"
                className="w-full h-full help-banner object-cover max-w-full max-h-banner object-right"
              />
            </div>

            <Layout className="text-center">
              <Typography className="mb-6 font-medium font-mont">
                We are ready to engage you in Jewish learning that captivates
                the soul and inspires the mind. What can we{' '}
                <span className="sm:whitespace-nowrap">
                  help you with today?
                </span>
              </Typography>
              <div className="flex flex-col items-center justify-center mb-12 lg:flex-row lg:space-x-7">
                <Button
                  type="button"
                  buttonContent="Contact Maven Support"
                  action={() => {
                    location.href = 'mailto:mavensupport@aju.edu'
                  }}
                  className="w-full sm:w-auto mb-7 lg:mb-0"
                />
                <Button
                  type="button"
                  buttonContent="Press and Media Inquiries"
                  action={() => {
                    location.href = 'mailto:communications@aju.edu'
                  }}
                  className="w-full sm:w-auto"
                />
              </div>

              <Typography
                variant="subheading"
                className="w-full lg:w-auto py-6 lg:py-3.5 border-t-2 border-b-2 border-gray-100 inline-block mb-6"
              >
                FAQs
              </Typography>

              <Typography className="mb-12">
                Thank you for visiting our Frequently Asked Questions page. We
                have curated a list of most commonly asked questions for you
                below. If you require additional assistance, please submit a
                ticket to our Maven Support by sending an email to{' '}
                <a href="mailto:mavensupport@aju.edu">mavensupport@aju.edu</a>.
                Our helpdesk will do their do their best to answer your question
                within 1 business day.
              </Typography>

              <Accordion
                title={'Account Setup'}
                items={accountSetupData}
                key={0}
              />
              <Accordion
                title={'For Registered Users'}
                items={forRegisteredUsersData}
                key={1}
              />
              <Accordion title={'Payments'} items={paymentData} key={2} />
              <Accordion
                title={'For Registered Partners'}
                items={forRegisteredPartnersData}
                key={3}
              />

              <Typography className="mb-6 text-center">
                Require additional assistance? Contact our Maven Support now or
                drop us an email.
              </Typography>

              <div className="mb-12">
                <Button
                  type="button"
                  buttonContent="mavensupport@aju.edu"
                  action={() => {
                    location.href = 'mailto:mavensupport@aju.edu'
                  }}
                  icon={'/images/email.svg'}
                />
              </div>
            </Layout>
          </main>
        </>
      )}
      <MailingList />
      <Footer />
    </section>
  )
}

export default Faq
