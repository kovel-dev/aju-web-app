/* eslint-disable */
import CheckboxGroup from '../form/checkboxGroup'
import { useState } from 'react'
import {
  elementScrollIntoViewPolyfill,
  elementScrollIntoView,
} from 'seamless-scroll-polyfill'
import { Richtext } from '../partials'
import { getPublicIdFromURL } from '../../lib/handlers/helper-handlers'
import CloudinaryImage from '@components/blocks/cloudinary-image'

const ProfileContainer = ({ schema, className, updateSpeakersProp, page }) => {
  const [oneItem, setOneItem] = useState(null)
  const [selectedSpeakers, setSelectedSpeakers] = useState([])

  const toggleBio = (e, index) => {
    if (oneItem - 1 === index) {
      setOneItem(null)
    } else {
      elementScrollIntoViewPolyfill()
      setOneItem(index + 1)
      document.getElementById('button-' + index).scrollIntoView({
        inline: 'nearest',
        behavior: 'auto',
        block: 'nearest',
      })
      elementScrollIntoView(document.getElementById('button-' + index), {
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
    }
  }

  const updateSpeakerList = (value, index) => {
    const newSelectedSpeakers = [...selectedSpeakers]

    if (value) {
      newSelectedSpeakers.push(value)
      setSelectedSpeakers(newSelectedSpeakers)
    } else {
      const removeIndex = selectedSpeakers.indexOf(index)
      newSelectedSpeakers.splice(removeIndex, 1)
      setSelectedSpeakers(newSelectedSpeakers)
    }

    updateSpeakersProp(newSelectedSpeakers)
  }
  return (
    <div className="w-full -mx-1 -my-5">
      <div
        className={`${
          className ? className : 'max-w-wrapper'
        } mx-auto flex lg:flex-wrap lg:overflow-x-visible space-x-6 lg:space-x-0 ${
          oneItem ? 'overflow-hidden' : 'overflow-x-auto'
        }`}
      >
        {schema.map((item, index) => {
          const cloudinaryPublicID = getPublicIdFromURL(item.profile_image_url)
          return (
            <>
              <div
                className={`p-6 w-1/3 card relative ${
                  oneItem ? 'lg:pb-6 pb-12' : ''
                }`}
                key={item.name}
                id={'profile-' + index}
              >
                <div
                  className={`card callout-shadow flex flex-col justify-between lg:py-12 lg:px-8 p-6 h-full`}
                  key={index}
                  id={'card-' + index}
                >
                  <div>
                    <div className="flex-shrink-0 w-48 h-48 mx-auto overflow-hidden img-container circle">
                      {cloudinaryPublicID ? (
                  <CloudinaryImage
                    defaultAltText="Profile image of speaker"
                    publicId={cloudinaryPublicID}
                    className="object-cover profile-img w-48 h-48"
                  />
                ) : (
                  <img
                        src={item.profile_image_url}
                        className="object-cover profile-img w-48 h-48"
                        alt="Profile image of speaker"
                      />
                )}
                      
                    </div>
                    <h3
                      className={`sm:px-2 py-2 pl-3 text-xl font-bold leading-6 text-center text-blue-850 ${
                        item.speaker ? 'my-2' : 'my-7'
                      }`}
                    >
                      {item.name},<span className="block">{page=='product' ? item.role? item.role?.charAt(0).toUpperCase() +
                    item.role?.slice(1) :'' :item.job}</span>
                    </h3>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    {item.speaker && (
                      <CheckboxGroup
                        label="Book this speaker"
                        speaker={true}
                        options={[
                          {
                            id: 'speaker-' + index,
                            name: 'speaker_' + index,
                            label: 'I want to book this speaker',
                          },
                        ]}
                        valueProp={(value) => {
                          let isChecked = value['speaker-' + index]

                          if (isChecked) {
                            updateSpeakerList(
                              {
                                refId: schema[index].id,
                                name: schema[index].name,
                              },
                              index
                            )
                          } else {
                            updateSpeakerList('', index)
                          }
                        }}
                        hideLabel={true}
                      />
                    )}
                    <div className={`w-full ${item.speaker ? 'mt-8' : ''}`}>
                      <button
                        className={`font-mont text-white text-center block mx-auto font-bold px-10 py-3 ${
                          oneItem - 1 === index ? 'bg-blue-450' : 'bg-blue-850'
                        }`}
                        onClick={(e) => {
                          toggleBio(e, index)
                        }}
                        id={'button-' + index}
                      >
                        {oneItem - 1 === index ? 'Hide' : 'Show'} Bio
                      </button>
                    </div>
                  </div>
                </div>
                {oneItem - 1 === index && (
                  <div className="absolute bottom-0 flex items-end justify-center w-full lg:hidden">
                    <span className="triangle-top"></span>
                  </div>
                )}
              </div>

              {oneItem && (
                <>
                  {(index + 1) % 3 === 0 || schema.length === index + 1 ? (
                    <div
                      className={`px-6 mb-3 w-full flex-col justify-center ${
                        oneItem % 3 === 0 ? 'items-end' : ''
                      }${(oneItem + 2) % 3 === 0 ? 'items-start' : ''}${
                        (oneItem + 1) % 3 === 0 ? 'items-center' : ''
                      } ${
                        index - (oneItem - 1) <
                          ((index + 1) % 3 === 0 ? 3 : schema.length % 3) &&
                        index - (oneItem - 1) >= 0
                          ? 'lg:flex hidden'
                          : 'hidden'
                      }`}
                    >
                      <div
                        className={`flex items-end justify-center w-1/3 ${
                          oneItem % 3 === 0 ? 'pl-6' : ''
                        }${(oneItem + 2) % 3 === 0 ? 'pr-6' : ''}`}
                      >
                        <span className="relative triangle-top top-1"></span>
                      </div>
                      <div className={`bg-blue-450 p-12 text-white w-full`}>
                        <h3 className="mb-3 text-xl font-bold leading-6">
                          {schema[oneItem - 1].name},&nbsp;
                          <span className="">{page=='product' ? schema[oneItem - 1].role ? schema[oneItem - 1].role?.charAt(0).toUpperCase() +
                    schema[oneItem - 1].role?.slice(1) : '' : schema[oneItem - 1].job}</span>
                        </h3>
                        {/* <p className="leading-7">{schema[oneItem - 1].bio}</p> */}
                        <Richtext
                          text={schema[oneItem - 1].bio}
                          className="mb-10 text-left lg:mb-10"
                        />
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </>
          )
        })}
      </div>

      {oneItem && (
        <div className="px-6 max-w-wrapper lg:hidden">
          <div
            className={`bg-blue-450 pt-10 pb-7 px-4 text-white w-full relative bottom-0.5`}
          >
            <h3 className="mb-3 text-xl font-bold leading-6">
              {schema[oneItem - 1].name},&nbsp;
              <br />
              <span className="">{schema[oneItem - 1].job}</span>
            </h3>
            {/* <p className="text-sm leading-6 sm:text-base">
              {schema[oneItem - 1].bio} */}
            <Richtext
              text={schema[oneItem - 1].bio}
              className="mb-10 text-left lg:mb-10"
            />
            {/* </p> */}
          </div>
        </div>
      )}
    </div>
  )
}
export default ProfileContainer
