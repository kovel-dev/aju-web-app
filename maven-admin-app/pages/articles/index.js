import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/client'

import { server } from '../../lib/config/server'
import Notification from '../../components/shared/notification'
import ListOfProducts from '../../components/products/list'
import TableView from '../../components/articles/table-view'

const ArticleListPage = () => {
  const router = useRouter()
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState({
    variant: '',
    msg: '',
  })

  const closeNotification = () => {
    setShowNotification(false)
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
        <h1 className="col-span-2 text-2xl font-semibold text-gray-900">
          All Articles
        </h1>
        <div className="text-right">
          <a
            href={`${server}/articles/create`}
            className="w-1/3 px-3 py-2 text-sm font-medium leading-4 text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Create Article
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

export default ArticleListPage
