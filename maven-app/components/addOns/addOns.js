import { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'

import { Typography, Card } from '@components'

const AddOns = ({ title, items, className: wrapperStyle }) => {
  const [active, setActive] = useState(true)
  const [height, setHeight] = useState('0px')

  const contentSpace = useRef(null)

  useEffect(() => {
    setHeight(contentSpace.current.scrollHeight + 'px')
  }, [])

  const toggleAccordion = () => {
    setActive(active === false ? true : false)
    setHeight(active ? '0px' : `${contentSpace.current.scrollHeight}px`)
  }

  return (
    <div className={classNames('w-full', wrapperStyle)}>
      <div
        className="flex items-center cursor-pointer px-4"
        onClick={toggleAccordion}
      >
        <Typography variant="subheading-2" className="mr-2">
          {title}
        </Typography>
        <FontAwesomeIcon
          icon={active ? faSortDown : faSortUp}
          className={classNames(
            'inline-block  text-blue-850 text-2xl',
            active ? 'mb-2' : 'mt-2'
          )}
        />
      </div>
      <div
        ref={contentSpace}
        style={{ maxHeight: `${height}` }}
        className="mt-4 overflow-hidden duration-300 ease-in-out transition-max-height"
      >
        {items.length <= 0 && (
          <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
            <p className="text-center text-blue-850">No Record(s) Found.</p>
          </div>
        )}
        {items.map((item, itemIndex) => (
          <Card
            className="block gap-8 px-4 py-8 mx-4 text-center md:py-12 md:px-11 md:text-left md:flex md:mb-14 mb-8"
            key={itemIndex}
          >
            <img
              src="/images/video.png"
              alt="customer suppport image"
              className="object-cover w-40 h-40 mx-auto mb-2 lg:mb-0"
            />
            <div className="flex flex-col justify-between flex-1">
              <div className="mb-6 lg:mb-0">
                <Typography variant="subheading-2" className="lg:mb-4">
                  {item.program}
                </Typography>
                <Typography color="text-blue-850">{item.date}</Typography>
              </div>
              <div className="flex flex-col justify-between lg:flex-row">
                <Typography className="mb-6 text-lg lg:mb-0">
                  {item.sponsor}
                </Typography>
                <Typography>
                  <a href={item.link} className="underline">
                    View Details
                  </a>
                </Typography>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AddOns
