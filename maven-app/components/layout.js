import classNames from 'classnames'

const Layout = ({ children, className: wrapperStyle }) => {
  return (
    <div className={classNames('px-5 mx-auto max-w-wrapper', wrapperStyle)}>
      {children}
    </div>
  )
}

export default Layout
