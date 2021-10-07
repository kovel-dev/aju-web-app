import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition, Popover } from '@headlessui/react'
import {
  CollectionIcon,
  DocumentIcon,
  HomeIcon,
  LibraryIcon,
  MenuAlt2Icon,
  PhotographIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  TagIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
  VideoCameraIcon,
  ViewListIcon,
  XIcon,
} from '@heroicons/react/outline'
import { ChevronDownIcon, NewspaperIcon } from '@heroicons/react/solid'
import { useSession, signOut } from 'next-auth/client'
import Logo from './logo'
import { useRouter } from 'next/router'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
  {
    name: 'Organizations',
    href: '/organizations',
    icon: LibraryIcon,
    current: false,
  },
  { name: 'All Users', href: '/users', icon: UsersIcon, current: false },
  {
    name: 'Pending Partners',
    href: '/pending-partners',
    icon: UserGroupIcon,
    current: false,
  },
  { name: 'Assets', href: '/assets', icon: PhotographIcon, current: false },
  { name: 'Tags', href: '/tags', icon: TagIcon, current: false },
  {
    name: 'Questions Manager',
    href: '/questions',
    icon: QuestionMarkCircleIcon,
    current: false,
  },
  { name: 'Hosts', href: '/hosts', icon: UserIcon, current: false },
  { name: 'Promo Codes', href: '/promo-codes', icon: StarIcon, current: false },
  {
    name: 'Programs',
    href: '/products',
    icon: VideoCameraIcon,
    current: false,
  },
  {
    name: 'Pages and Settings',
    href: '/pages-and-settings',
    icon: DocumentIcon,
    current: false,
  },
  { name: 'Articles', href: '/articles', icon: CollectionIcon, current: false },
  {
    name: 'Contact Us Messages',
    href: '/contact-us',
    icon: ViewListIcon,
    current: false,
  },
  {
    name: 'Newsletters',
    href: '/newsletters',
    icon: NewspaperIcon,
    current: false,
  },
  {
    name: 'Partner Requests',
    href: '/partner-requests',
    icon: NewspaperIcon,
    current: false,
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: NewspaperIcon,
    current: false,
  },
  {
    name: 'Suggestions',
    href: '/suggestions',
    icon: NewspaperIcon,
    current: false,
  },
]
const userNavigation = [
  { name: 'Sign out', href: '#', handlerFunction: signOutHandler },
]
const impLinks = [
  {
    name: 'AJU Users Portal',
    description: 'Main Website used by users and partners',
    href: '#',
  },
  {
    name: 'Resources',
    description: 'Important Files to help admins',
    href: '#',
  },
  { name: 'Support', description: 'Reach to Elite Support team.', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function signOutHandler() {
  signOut()
}

export default function AdminLayout(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [session] = useSession()
  const router = useRouter()
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 flex z-40 md:hidden"
          open={sidebarOpen}
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-primary">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 flex items-center text-white text-center mx-auto font-bold px-4">
                <Logo />
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        router.pathname.includes(item.href)
                          ? 'bg-primary-dark text-white'
                          : 'text-indigo-100 hover:bg-primary-dark',
                        'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                      )}
                    >
                      <item.icon
                        className="mr-4 flex-shrink-0 h-6 w-6 text-white-300"
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden bg-primary md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center text-white text-center mx-auto font-bold flex-shrink-0 px-4">
              <Logo />
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      router.pathname.includes(item.href)
                        ? 'bg-primary-dark text-white'
                        : 'text-indigo-100 hover:bg-primary-dark',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className="mr-3 flex-shrink-0 h-6 w-6 text-white-300"
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-0 flex">
              <Popover className="z-0 relative max-w-8xl m-auto px-4 sm:px-6 md:px-8">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={classNames(
                        open ? 'text-gray-900' : 'text-gray-500',
                        'group bg-white rounded-sm inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
                      )}
                    >
                      <span>Important Links</span>
                      <ChevronDownIcon
                        className={classNames(
                          open ? 'text-gray-600' : 'text-gray-400',
                          'ml-2 h-5 w-5 group-hover:text-gray-500'
                        )}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel
                        static
                        className="absolute z-10 transform mt-3 left-1/2 md:left-0 -translate-x-1/2 md:-translate-x-0 px-2 w-screen max-w-xs sm:px-0"
                      >
                        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                          <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                            {impLinks.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className="-m-3 p-3 block rounded-md hover:bg-gray-50 transition ease-in-out duration-150"
                              >
                                <p className="text-base font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.description}
                                </p>
                              </a>
                            ))}
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span className="sr-only">View notifications</span>
                                <BellIcon className="h-6 w-6" aria-hidden="true" />
                            </button> */}

              {/* Profile dropdown */}
              <Menu as="div" className="ml-3 relative">
                {({ open }) => (
                  <>
                    <div className="inline-flex">
                      <div className="m-auto">Welcome {session.user.name}</div>
                      <Menu.Button className="max-w-xs bg-white flex ml-5 items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        <span className="sr-only">Open user menu</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
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
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                onClick={item.handlerFunction}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">{props.children}</div>
        </main>

        <div id="modal-root"></div>
      </div>
    </div>
  )
}
