import { server } from '../../lib/config/server'
import * as Cx from '@coreui/react'

function SideBar() {
  return (
    <Cx.CNav className="flex-column">
      <Cx.CNavItem>
        <Cx.CNavLink href={`${server}/dashboard`}>Dashboard</Cx.CNavLink>
      </Cx.CNavItem>
      <Cx.CNavItem>
        <Cx.CNavLink href={`${server}/users`}>Users</Cx.CNavLink>
      </Cx.CNavItem>
      <Cx.CNavItem>
        <Cx.CNavLink href={`${server}/organizations`}>
          Organizations
        </Cx.CNavLink>
      </Cx.CNavItem>
      <Cx.CNavItem>
        <Cx.CNavLink href={`${server}/products`}>Products</Cx.CNavLink>
      </Cx.CNavItem>
      <Cx.CNavItem>
        <Cx.CNavLink href={`${server}/promo-codes`}>Promo Codes</Cx.CNavLink>
      </Cx.CNavItem>
      <Cx.CNavItem>
        <Cx.CNavLink href={`${server}/questions`}>Questions</Cx.CNavLink>
      </Cx.CNavItem>
      <Cx.CNavItem>
        <Cx.CNavLink href={`${server}/tags`}>Tags</Cx.CNavLink>
      </Cx.CNavItem>
      <Cx.CNavItem>
        <Cx.CNavLink href={`${server}/hosts`}>Hosts</Cx.CNavLink>
      </Cx.CNavItem>
      <Cx.CNavItem>
        <Cx.CNavLink href={`${server}/assets`}>Asset Manager</Cx.CNavLink>
      </Cx.CNavItem>
    </Cx.CNav>
  )
}

export default SideBar
