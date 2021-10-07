import React from 'react'
import VideoJS from '../Video/Reactvideo'
import { getPublicIdFromURL } from '../../../lib/handlers/helper-handlers'
import CloudinaryImage from '@components/blocks/cloudinary-image'

export const Content = ({
  className,
  src,
  entitlement,
  type,
  videoLink,
  isProgramAccess,
}) => {
  const playerRef = React.useRef(null)
  const videoJsOptions = {
    // lookup the options in the docs for more options
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        //type: 'video/mp4',
      },
    ],
  }

  const handlePlayerReady = (player) => {
    playerRef.current = player

    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting')
    })

    player.on('dispose', () => {
      console.log('player will dispose')
    })
  }

  const cloudinaryPublicID = getPublicIdFromURL(src)

  return (
    <div className={`bg-white relative ${className ? className : ''}`}>
      {entitlement && isProgramAccess ? (
        <>
          {type === 'on-demand' ? (
            <>
              <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            </>
          ) : (
            <>
              <a href={videoLink} target="_blank" rel="noreferrer">
                {cloudinaryPublicID ? (
                  <CloudinaryImage
                    defaultAltText="Program Hero Image"
                    publicId={cloudinaryPublicID}
                    className={`object-fill ${className ? className : ''}`}
                  />
                ) : (
                  <img
                    src={src}
                    className={`object-fill ${className ? className : ''}`}
                  />
                )}
              </a>
            </>
          )}
        </>
      ) : (
        <>
          {cloudinaryPublicID ? (
            <CloudinaryImage
              defaultAltText="Program Hero Image"
              publicId={cloudinaryPublicID}
              className={`object-fill ${className ? className : ''}`}
            />
          ) : (
            <img
              src={src}
              className={`object-fill ${className ? className : ''}`}
            />
          )}
          {type === 'on-demand' && (
            <span className="absolute flex items-center justify-center w-10 h-10 transform -translate-x-1/2 -translate-y-1/2 rounded-sm md:w-14 md:h-14 bg-blue-850 top-1/2 left-1/2">
              <img src="/images/play.png" className="w-3 md:w-5" />
            </span>
          )}
        </>
      )}
      {/* 
      {type === 'on-demand' ?
       <>
        {entitlement && isProgramAccess &&  
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        }
       </> : <></>}
      {entitlement && isProgramAccess && type === 'on-demand' ? (
        // <iframe
        //   className={`object-fill ${className ? className : ''}`}
        //   src="https://www.youtube.com/embed/2CipVwISumA"
        //   frameBorder="0"
        //   allowFullScreen
        // ></iframe>

        
      ) : (
        <>
          <img
            src={src}
            className={`object-fill ${className ? className : ''}`}
          />
          {type === 'on-demand' && (
            <span className="absolute flex items-center justify-center w-10 h-10 transform -translate-x-1/2 -translate-y-1/2 rounded-sm md:w-14 md:h-14 bg-blue-850 top-1/2 left-1/2">
              <img src="/images/play.png" className="w-3 md:w-5" />
            </span>
          )}
        </>
      )} */}
    </div>
  )
}
