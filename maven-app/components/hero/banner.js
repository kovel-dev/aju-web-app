import React from 'react'
// import Button from '../form/button'
import CalloutBtn from '../callout/calloutBtn'
import Link from 'next/link'
import { getPublicIdFromURL } from '../../lib/handlers/helper-handlers'
import CloudinaryImage from '@components/blocks/cloudinary-image'

const Banner = ({ img, ctaContent, ctaBtnContent, ctaLink }) => {
  const cloudinaryPublicID = getPublicIdFromURL(img)
  const cloundName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  return (
    <div className="w-full">
      <Link href={ctaLink}>
        <a>
          {cloudinaryPublicID ? (
            <CloudinaryImage
              defaultAltText="Hero banner image"
              publicId={cloudinaryPublicID}
              crop="fill"
              height="800"
              width="1920"
            />
          ) : (
            <img src={img} alt={ctaContent} />
          )}
        </a>
      </Link>
      <CalloutBtn
        mainContent={ctaContent}
        btnContent={ctaBtnContent}
        ctaLink={ctaLink}
      />
    </div>
  )
}
export default Banner
