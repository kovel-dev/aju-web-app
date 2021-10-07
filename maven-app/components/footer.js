import React from 'react'
import Link from 'next/link'
import '@fortawesome/free-brands-svg-icons'
import {
  faInstagram,
  faFacebookF,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Footer = () => {
  return (
    <footer className="w-full pt-6 pb-12 text-white bg-blue-850 sm:py-10 no-printme">
      <div className="px-5 mx-auto max-w-wrapper">
        <div className="flex flex-col items-center justify-between lg:flex-row lg:items-start footer-main">
          <div className="md:pt-4 md:pb-4 md:pr-4 lg:pl-0 md:pl-4">
            <div className="flex flex-col text-center footer-links md:flex-row md:text-left">
              <div className="flex flex-col items-center justify-center space-y-4 md:border-r-2 md:border-white md:block">
                <Link href="https://www.aju.edu/">
                  <a className="md:mr-6">Main AJU Website</a>
                </Link>
                <Link href="/faq">
                  <a className="md:mr-6">FAQs</a>
                </Link>
                {/* <Link href={process.env.NEXT_PUBLIC_ADMIN_URL}><a className="md:mr-6">Admin</a></Link> */}
              </div>
              <div className="flex items-center px-5 py-6 social-links md:py-0">
                <a
                  className="mr-5"
                  href="https://www.instagram.com/americanjewishu/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faInstagram} className="w-3 h-auto" />
                </a>
                <a
                  className="mr-5"
                  href="https://www.facebook.com/AmericanJewishUniversity"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a
                  className="mr-5"
                  href="https://twitter.com/AmericanJewishU"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a
                  className="md:mr-5"
                  href="https://www.youtube.com/user/AmericanJewishUniv"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </div>
            </div>
            <p className="hidden mt-6 text-xs lg:block">
              Copyright 2021 © Maven
            </p>
          </div>
          <div className="h-auto max-w-footer-logo">
            <Link href="/">
              <a>
                <img src="/images/maven_logo_white.png" />
              </a>
            </Link>
          </div>
          <p className="block mt-6 text-xs text-center lg:hidden">
            Copyright 2021 © Maven
          </p>
        </div>
      </div>
    </footer>
  )
}
export default Footer
