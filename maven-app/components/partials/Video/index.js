import React from 'react'
import VideoJS from './Reactvideo'

export const Video = ({ className, src, entitlement, type, videoLink }) => {
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

  return (
    <div className={`bg-white relative ${className ? className : ''}`}>
      {entitlement ? (
        // <iframe
        //   className={`object-fill ${className ? className : ''}`}
        //   src="https://www.youtube.com/embed/2CipVwISumA"
        //   frameBorder="0"
        //   allowFullScreen
        // ></iframe>

        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
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
      )}
    </div>
  )
}
