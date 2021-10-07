import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import classNames from 'classnames'

import Typography from '@components/typography'

const BaseMenu = ({
  className: wrapperStyle,
  options,
  selectedId,
  placeholder,
  onSelect,
}) => {
  return (
    <Menu
      as="div"
      className={classNames('relative inline-block', wrapperStyle)}
    >
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="inline-flex items-center justify-between w-full py-2 pl-3 pr-2 bg-white border rounded-sm text-gray-950 border-gray-75">
              <Typography className="pr-3">
                {selectedId === null ? placeholder : options[selectedId]}
              </Typography>

              <ChevronDownIcon
                className="flex items-center justify-center w-8 h-8 text-white bg-blue-850"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute right-0 mt-1 bg-white rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="py-1">
                {options.map((option, optionIndex) => (
                  <Menu.Item key={optionIndex}>
                    {({ active }) => (
                      <div
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm cursor-pointer'
                        )}
                        onClick={onSelect(optionIndex)}
                      >
                        <Typography>{option}</Typography>
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default BaseMenu
