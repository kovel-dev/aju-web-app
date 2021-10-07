import React, { useEffect, useState } from 'react'
import { CloudinaryContext, Image, Transformation } from 'cloudinary-react'
import { getCloudinaryAsset } from 'lib/handlers/helper-handlers'

function CloudinaryImage(props) {
  //   let cloudinary = require('cloudinary').v2
  const [altText, setAltText] = useState(props.defaultAltText)
  useEffect(async () => {
    // cloudinary.api.resource(props.publicId, function (error, result) {
    //   console.log('result: ', result)
    // })
    let cloudinaryAsset = await getCloudinaryAsset(props.publicId)
    if (cloudinaryAsset.data.context !== undefined) {
      setAltText(
        cloudinaryAsset.data.context.custom !== undefined
          ? cloudinaryAsset.data.context.custom.alt
          : props.defaultAltText
      )
    }
  }, [])
  const cloundName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  return (
    <>
      <Image
        cloudName={cloundName}
        secure="true"
        publicId={props.publicId}
        loading="lazy"
        className={props.className ? props.className : ''}
        alt={altText}
      >
        <Transformation
          aspectRatio={props.aspectRatio}
          crop={props.crop ? props.crop : 'scale'}
          width={props.width ? props.width : '1.0'}
          height={props.height ? props.height : '1.0'}
        />
      </Image>
    </>
  )
}

export default CloudinaryImage
