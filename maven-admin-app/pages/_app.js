import React from 'react'
import { useRouter } from 'next/router'
import { Provider, useSession } from 'next-auth/client'
import AdminLayout from '../components/layouts/admin-layout'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider
        session={pageProps.session}
        options={{
          clientMaxAge: 30, // Re-fetch session if cache is older than 60 seconds
          keepAlive: 60, // Send keepAlive message every 5 minutes
        }}
      >
        {!Component.auth ? ( //Check If the Page needs authentication
          <Auth>
            <AdminLayout session={pageProps.session}>
              <Component {...pageProps} />
            </AdminLayout>
          </Auth>
        ) : (
          // Pages that are outside of the authenticaiton like Sign-in
          <Component {...pageProps} />
        )}
      </Provider>
    </>
  )
}

function Auth({ children }) {
  const [session, loading] = useSession()
  const isUser = !!session?.user
  const router = useRouter()
  React.useEffect(() => {
    if (loading) return // Do nothing while loading
    if (!isUser) router.push('/sign-in') // If not authenticated, force log in
  }, [isUser, loading, router])

  if (isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>
}

export default MyApp
