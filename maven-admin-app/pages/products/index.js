import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/client'

import { server } from '../../lib/config/server'
import TableView from '../../components/products/table-view'
import Notification from '../../components/shared/notification'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function ProductListPage() {
  const router = useRouter()
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState({
    variant: '',
    msg: '',
  })

  const [tabs, setTabs] = useState([
    { name: 'All Programs', href: '#', current: true },
    { name: 'Archives', href: '#', current: false },
  ])
  const [currentTab, setCurrentTab] = useState('All Programs')

  const closeNotification = () => {
    setShowNotification(false)
  }

  const changeTabsHandler = (label) => {
    let newTab = tabs.map((item, index) => {
      if (item.name == label) {
        setCurrentTab(label)
        return { name: label, href: '#', current: true }
      } else {
        return { name: item.name, href: '#', current: false }
      }
    })

    setTabs(newTab)
  }

  useEffect(() => {
    if (router.query.status === 'created') {
      setShowNotification(true)
      setNotificationMsg({
        variant: 'success',
        msg: 'Created successfully',
      })
    }
  }, [router.query.status])

  //return <ListOfProducts />;
  return (
    <>
      {showNotification && (
        <Notification
          variant={notificationMsg.variant}
          msg={notificationMsg.msg}
          closeHandler={closeNotification}
        />
      )}
      <div className="grid grid-cols-3 px-4 mx-auto max-w-8xl sm:px-6 md:px-8">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            defaultValue={tabs.find((tab) => tab.current).name}
            onClick={(e) => {
              changeTabsHandler(e.currentTarget.value)
            }}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  className={classNames(
                    tab.current
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                  )}
                  aria-current={tab.current ? 'page' : undefined}
                  onClick={() => {
                    changeTabsHandler(tab.name)
                  }}
                >
                  {tab.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {currentTab == 'All Programs' && (
        <>
          <div className="grid grid-cols-3 px-4 mt-5 mx-auto max-w-8xl sm:px-6 md:px-8">
            <h1 className="col-span-2 text-2xl font-semibold text-gray-900">
              All Programs
            </h1>
            <div className="text-right">
              <a
                href={`${server}/products/create`}
                className="w-1/3 px-3 py-2 text-sm font-medium leading-4 text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Create Program
              </a>
            </div>
          </div>
          <div className="px-4 mx-auto max-w-8xl sm:px-6 md:px-8">
            {/* Replace with your content */}
            <div className="py-4">
              <TableView />
            </div>
            {/* /End replace */}
          </div>
        </>
      )}

      {currentTab == 'Archives' && (
        <>
          <div className="grid grid-cols-3 px-4 mt-5 mx-auto max-w-8xl sm:px-6 md:px-8">
            <h1 className="col-span-2 text-2xl font-semibold text-gray-900">
              All Archived Programs
            </h1>
          </div>
          <div className="px-4 mx-auto max-w-8xl sm:px-6 md:px-8">
            {/* Replace with your content */}
            <div className="py-4">
              <TableView archives />
            </div>
            {/* /End replace */}
          </div>
        </>
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: `${server}/sign-in`,
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default ProductListPage
