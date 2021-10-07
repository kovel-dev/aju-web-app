import { useEffect, useState } from 'react'
import { FacebookShareButton, TwitterShareButton } from 'react-share'

import { Text } from '../Text'
import {
  faInstagram,
  faFacebookF,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const Icon = ({ img, className, text, type, s_date, e_date }) => {
  const [fbLink, setFbLink] = useState('')
  const [twitterLink, setTwitterLink] = useState('')

  useEffect(() => {
    setFbLink(window.location.href)
    setTwitterLink(window.location.href)
  }, [])
  return (
    <div
      className={`flex items-start justify-start flex-shrink-0 w-full rounded-sm img-container ${
        className ? className : ''
      }`}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-sm bg-blue-850 min-w-icon">
        <img src={img} alt="map marker icon" className={`w-5 h-5`} />
      </div>
      {type === 'text' || type === 'time' ? (
        <Text text={text} className="pt-1 ml-6" />
      ) : type === 'date' ? (
        <div className="pt-1 ml-6">
          <div className="flex items-center justify-start">
            <p className="text-base font-bold lg:text-xl">Start: </p>
            <Text text={s_date} className="ml-1 " />
          </div>
          <div className="flex items-center justify-start">
            <p className="text-base font-bold lg:text-xl">End: </p>
            <Text text={e_date} className="ml-1 " />
          </div>
        </div>
      ) : type === 'social' ? (
        <div className="flex items-center justify-start pt-1 ml-6 text-blue-850 event-social-icons">
          <a className="mr-6" href="http://google.com">
            <FontAwesomeIcon icon={faInstagram} className="h-auto w-7" />
          </a>
          <FacebookShareButton
            url={fbLink}
            quote={'Maven App'}
            hashtag={'#Events & Classes'}
            description={'MAVEN Events & Classes'}
            className="mr-6"
          >
            <FontAwesomeIcon icon={faFacebookF} className="w-4 h-auto" />
          </FacebookShareButton>

          <TwitterShareButton
            title={'MAVEN Events & Classes'}
            url={twitterLink}
            hashtags={['Events & Classes']}
            className="mr-6"
          >
            <FontAwesomeIcon icon={faTwitter} className="h-auto w-7" />
          </TwitterShareButton>
          <a className="md:mr-6" href="http://google.com">
            <FontAwesomeIcon icon={faYoutube} className="h-auto w-7" />
          </a>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
