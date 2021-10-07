import { getPublicIdFromURL } from '../../lib/handlers/helper-handlers'
import CloudinaryImage from './cloudinary-image'

const QuoteContainer = ({ schema }) => {
  return (
    <div className="w-full sm:my-12 my-10">
      <div className="max-w-wrapper mx-auto px-5 flex lg:space-x-12 justify-center lg:flex-row flex-col space-y-6 lg:space-y-0">
        {schema.map((item, index) => {
          const cloudinaryPublicID = getPublicIdFromURL(item.image)
          const cardImageAltText =
            'Thumbnail Image of ' + (item.firstName + ' ' + item.lastName)
          return (
            <div
              className={`card shadow-xl flex flex-col justify-between`}
              key={index}
            >
              <div className="flex bg-blue-450">
                <div className="img-container flex-shrink-0 h-20 w-20 overflow-hidden">
                  {/* <img
                    src={item.image}
                    className="h-20 w-auto object-cover object-center"
                    alt="Profile image of person"
                  /> */}
                  {cloudinaryPublicID ? (
                    <CloudinaryImage
                      defaultAltText={cardImageAltText}
                      publicId={cloudinaryPublicID}
                      width="80"
                      height="94"
                    />
                  ) : (
                    <img src={item.img} alt={cardImageAltText} />
                  )}
                </div>
                <h3 className="uppercase font-bold pl-3 leading-7 text-white p-2 text-2xl flex flex-col justify-center">
                  {item.firstName}
                  <span className="block">{item.lastName}</span>
                </h3>
              </div>
              <div className="block-main flex flex-col justify-center items-center pb-5 pt-4">
                <img
                  src="/images/quote.png"
                  alt="quote image"
                  className="p-2"
                />
                <p className="p-3 text-center leading-6 w-3/4 mx-auto">
                  {item.quote}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default QuoteContainer
