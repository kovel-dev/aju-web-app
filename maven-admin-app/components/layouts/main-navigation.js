import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/client'
import * as Cx from '@coreui/react'

import { server, app_name } from '../../lib/config/server'
import classes from '../../styles/main-navigation.module.css'
import Sidebar from './sidebar'

function MainNavigation() {
  const [session, loading] = useSession()
  const [visible, setVisible] = useState(false)

  function logoutHandler() {
    signOut()
  }

  return (
    <>
      <Cx.CNavbar
        colorScheme="light"
        className="bg-light"
        placement="sticky-top"
      >
        <Cx.CContainer fluid>
          {session && (
            <Cx.CNavbarToggler
              onClick={() => setVisible(true)}
              className="mr-1"
            />
          )}
          <Cx.CNavbarBrand href={`${server}/`}>{app_name}</Cx.CNavbarBrand>
          <Cx.CNavbarNav className="d-flex">
            <Cx.CNavItem>
              {!session && !loading && (
                <Cx.CNavLink href={`${server}/sign-in`}>Sign In</Cx.CNavLink>
              )}
              {session && (
                <Cx.CNavLink
                  onClick={logoutHandler}
                  className={classes.signoutlink}
                >
                  Sign Out
                </Cx.CNavLink>
              )}
            </Cx.CNavItem>
          </Cx.CNavbarNav>
        </Cx.CContainer>
      </Cx.CNavbar>

      <Cx.COffcanvas
        placement="start"
        visible={visible}
        onDismiss={() => setVisible(false)}
      >
        <Cx.COffcanvasHeader>
          <Cx.COffcanvasTitle>{app_name}</Cx.COffcanvasTitle>
          <Cx.CButtonClose
            className="text-reset"
            onClick={() => setVisible(false)}
          />
        </Cx.COffcanvasHeader>
        <Cx.COffcanvasBody>
          <Sidebar />
        </Cx.COffcanvasBody>
      </Cx.COffcanvas>
    </>
  )
}

export default MainNavigation
