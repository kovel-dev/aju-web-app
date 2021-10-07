import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { FacebookShareButton, TwitterShareButton } from 'react-share'
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import style from './style.module.css'

const socialShareButton = ({
  className: wrapperStyle,
  variant,
  title = '',
  url: urlProp = '',
  hashtag = '',
  description = '',
}) => {
  const [url, setUrl] = useState(urlProp)

  useEffect(() => {
    setUrl(urlProp || window.location.href)
  }, [])

  return (
    <div className={classNames(wrapperStyle, style.share)}>
      {variant === 'facebook' && (
        <FacebookShareButton
          url={url}
          quote={title}
          hashtag={hashtag}
          description={description}
        >
          <FontAwesomeIcon icon={faFacebookF} className="w-4 h-auto" />
        </FacebookShareButton>
      )}
      {variant === 'twitter' && (
        <TwitterShareButton title={title} url={url} hashtags={[hashtag]}>
          <FontAwesomeIcon icon={faTwitter} className="h-auto w-7" />
        </TwitterShareButton>
      )}
    </div>
  )
}

export default socialShareButton
