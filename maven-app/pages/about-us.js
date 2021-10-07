import { useRouter } from 'next/router'

import {
  Meta,
  Footer,
  MailingList,
  Subheading,
  Navbar,
  CardContainer,
  ProfileContainer,
  Heading,
  ShowMore,
  Button,
} from 'components'
import pressData from 'constants/pressData'
import profileData from 'constants/profileData'
import meta from 'constants/meta'

export default function AboutUs() {
  const router = useRouter()

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.aboutUs.title}
        keywords={meta.aboutUs.keywords}
        description={meta.aboutUs.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <Heading
          breadcrumbs={[
            {
              link: '/',
              label: 'Home',
            },
            {
              link: '/about-us',
              label: 'About Us',
            },
          ]}
          heading="About Maven"
        />
        <p className="px-5 mx-auto mb-4 text-sm leading-6 text-center max-w-wrapper sm:text-base">
          In March of 2020, as the pandemic took hold of our local communities
          and safer-at-home orders were issued, American Jewish University
          shifted the delivery of our adult education and community programming
          to digital formats. Dedicated to providing Jewish learning to our
          communities, AJU understood the importance of showcasing original
          content that was not only easily accessible, but also fostered a sense
          of connection amidst the isolation that many faced.
        </p>
        <ShowMore
          content={[
            'The result was B’Yachad Together: Spirited by American Jewish University. This immersive and experiential digital learning platform elevates the voices and captures insights of guest speakers and AJU faculty, while advancing ideas, sparking dialogue, and igniting debate.',
            'Nearly a year later, the B’Yachad Together program has not only grown and matured, extending to all corners of the country and globe, but has reinvented itself as Maven. We’re currently accessed in all 50 states, as well as 45 countries, with an ever-expanding footprint in both name and vision. Today, we welcome you to continue this journey with us as we expand our brand, and connection with AJU’s legacy programs in the Whizin Center for Continuing Education and at Arts @ AJU. We invite you to become a Maven.',
            'We aim to build community and bring Jewish wisdom to the world in the hopes of helping people better understand themselves, their community, and the world around them. We’re here to inspire everyone.',
            'Thank you for sharing this journey.',
            'Maven is a program of American Jewish University. American Jewish University advances and elevates the Jewish journey of individuals, organizations, and our community through excellence in scholarship, teaching, engaged conversation, and outreach. American Jewish University (AJU) is a thriving center of Jewish resources and talent that serves the Jewish community of the twenty-first century. A portal for Jewish belonging, AJU equips students, faculty, campers, and learners of all ages with the tools to create the ideas, build the structures, and develop the programs to advance Jewish wisdom and elevate Jewish living.',
          ]}
        />
        <Subheading content="Meet the Maven Team" />
        <ProfileContainer schema={profileData} />
        <Subheading content="Maven In the Press" />
        <CardContainer schema={pressData.slice(0, 3)} noScroll={true} />
        <div className="flex items-center justify-center w-full my-10 sm:my-12">
          <Button
            type="button"
            buttonContent="View all Press"
            action={() => router.push('/in-the-press')}
          />
        </div>
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}
