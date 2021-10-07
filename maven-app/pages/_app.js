import '../styles/globals.css'

import { Provider, useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import TagManager from 'react-gtm-module'
import PageLoader from '@components/popup/page-loader'

function MyApp({ Component, pageProps }) {
  let isNeedAuthenticated = !!Component.auth
  const router = useRouter()

  const [pageLoading, setPageLoading] = useState(false)
  useEffect(() => {
    const handleStart = () => {
      setPageLoading(true)
    }
    const handleComplete = () => {
      setPageLoading(false)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)
  }, [router])

  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-NFDLGS4' })
  }, [])

  return (
    // <Provider session={pageProps.session}>
    //   <Component {...pageProps} />
    // </Provider>

    <>
      <Provider
        session={pageProps.session}
        options={{
          clientMaxAge: 30, // Re-fetch session if cache is older than 60 seconds
          keepAlive: 60, // Send keepAlive message every 5 minutes
        }}
      >
        {isNeedAuthenticated ? ( //Check If the Page needs authentication
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          // Pages that are outside of the authenticaiton like Sign-in
          <Component {...pageProps} />
        )}
        {pageLoading && (
          <PageLoader
            openPageLoader={pageLoading}
            pageLoaderTitleText="Loading..."
            pageLoaderSubText="Please wait for a moment."
          />
        )}
      </Provider>
    </>
  )
}

function Auth({ children }) {
  const [session, loading] = useSession()
  const router = useRouter()

  // check if user is present
  const isUser = !!session?.user

  useEffect(() => {
    if (loading) return // Do nothing while loading
    if (!isUser) router.replace('/login') // If not authenticated, force log in
  }, [isUser, loading, router])

  if (isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>
}

export default MyApp
