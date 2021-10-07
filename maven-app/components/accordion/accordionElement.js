import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Typography } from '@components'

const AccordionElement = ({ title, content }) => {
  const [active, setActive] = useState(false)
  const [height, setHeight] = useState('0px')
  const [rotate, setRotate] = useState('transform duration-300 ease')

  const contentSpace = useRef(null)

  const toggleAccordion = () => {
    setActive(active === false ? true : false)
    setHeight(active ? '0px' : `${contentSpace.current.scrollHeight}px`)
    setRotate(
      active
        ? 'transform duration-300 ease'
        : 'transform duration-300 ease rotate-180'
    )
  }

  return (
    <div className="flex flex-col py-6 border-b border-gray-400 lg:flex-row">
      <div
        className="w-full mr-8 cursor-pointer mb-7 lg:mb-0"
        onClick={toggleAccordion}
      >
        <div className="flex">
          <Typography>
            <span className="mr-4 font-bold text-blue-850">Q.</span>
          </Typography>
          <Typography>
            <div
              contentEditable="false"
              dangerouslySetInnerHTML={{ __html: title }}
            ></div>
          </Typography>
        </div>
        <div
          ref={contentSpace}
          style={{ maxHeight: `${height}` }}
          className="mt-4 overflow-hidden duration-300 ease-in-out transition-max-height"
        >
          <div className="flex">
            <Typography>
              <span className="mr-4 font-bold text-blue-850">A.</span>
            </Typography>
            <Typography>
              <div
                contentEditable="false"
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>
            </Typography>
          </div>
        </div>
      </div>
      <button
        className="w-10 h-10 mt-auto ml-8 text-white cursor-pointer bg-blue-850 lg:ml-0"
        onClick={toggleAccordion}
      >
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`${rotate} inline-block`}
        />
      </button>
    </div>
  )
}

export default AccordionElement
