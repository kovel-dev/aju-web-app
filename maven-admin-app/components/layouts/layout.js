import { useSession } from 'next-auth/client'
import { Fragment } from 'react'

import MainNavigation from './main-navigation'

function Layout(props) {
  const [session, loading] = useSession()

  return (
    <Fragment>
      <MainNavigation />
      <div className="container-fluid">{props.children}</div>
      <div id="modal-root"></div>
    </Fragment>
  )
}

export default Layout
