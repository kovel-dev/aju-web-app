import { useState } from 'react'
import { useRouter } from 'next/router'

import {
  Button,
  Footer,
  Heading,
  MailingList,
  Meta,
  Navbar,
  Subheading,
  Tabs,
} from 'components'
import meta from 'constants/meta'

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0)
  const router = useRouter()

  const updateTab = (newTab) => {
    setActiveTab(newTab)
  }

  const breadcrumbs = [
    {
      link: '/',
      label: 'Home',
    },
    {
      link: '/how-it-works',
      label: 'How It Works',
    },
  ]

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.howItWorks.title}
        keywords={meta.howItWorks.keywords}
        description={meta.howItWorks.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <Heading heading="How It Works" breadcrumbs={breadcrumbs} />

        <p className="px-5 mx-auto mb-10 text-sm leading-6 text-center lg:mb-12 max-w-wrapper sm:text-base">
          Through Maven, you get access to Jewish wisdom and education in a way
          that works for you. We offer access to free events, classes, and an on
          demand library. Accessing learning is easy, simply search our sign up
          for our mailing list, and get involved. From Jewish thought to book
          clubs, Hebrew language to art classes, there’s always something
          something for everyone. Our extraordinary faculty are qualified to
          mentor and guide each student, and our event offerings will engage you
          in dialogue and debate. Welcome to Maven, where we provide Jewish
          wisdom to the world.
        </p>
        <Tabs
          tabs={['Individuals', 'Community and Partners']}
          updateTabProp={updateTab}
        />
        {activeTab === 0 && (
          <div className="pb-20 mx-auto max-w-wrapper sm:pb-12">
            <Subheading content="Innovative Online Jewish Programming" />
            <p className="px-5 mx-auto mb-4 text-sm leading-6 text-center max-w-wrapper sm:text-base">
              We invite you to engage with us. AJU is working on innovative
              programming to meet the unparalleled challenges of a digital
              world. By partnering with us, you have the ability to leverage our
              programming for your constituents, making Jewish wisdom and
              learning easily accessible. As a university, we are uniquely
              positioned to collaborate with all types of partners regardless of
              religion and denomination.
            </p>
            <p className="px-5 mx-auto mt-8 mb-4 text-lg leading-6 text-center max-w-wrapper sm:mt-12">
              Ready to start your learning journey?
            </p>
            <div className="flex items-center justify-center mt-7">
              <Button
                type="button"
                style="blue"
                buttonContent="Explore Classes"
                disabled={false}
                action={() => router.push('/events-classes')}
              />
            </div>
          </div>
        )}
        {activeTab === 1 && (
          <div className="pb-20 mx-auto max-w-wrapper sm:pb-12">
            <Subheading content="Best-in-class digital learning" />
            <p className="px-5 mx-auto mb-4 text-sm leading-6 text-center max-w-wrapper sm:text-base">
              Our goal is to provide you with digital offerings and
              opportunities, including best-in-class content, access to
              scholars, personalized customer service and a lot more. We invite
              you to learn more about how we can help you grow your voice, serve
              your community, and increase your reach.
            </p>
            <p className="px-5 mx-auto mb-4 text-sm leading-6 text-center max-w-wrapper sm:text-base">
              As you are elevated, so are we.
            </p>
            <p className="px-5 mx-auto mt-8 mb-4 text-lg leading-6 text-center max-w-wrapper sm:mt-12">
              Ready to Engage your Community?
            </p>
            <div className="flex items-center justify-center mt-7">
              <Button
                type="button"
                style="blue"
                buttonContent="Become a Partner"
                disabled={false}
                action={() => router.push('/register/organization')}
              />
            </div>
          </div>
        )}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}
