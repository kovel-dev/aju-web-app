import ReactDOM from 'react-dom'
import * as Cx from '@coreui/react'
import { useEffect, useState } from 'react'

const Modal = ({ show, children, title, size, onShowModal }) => {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const modalContent = show ? (
    <>
      <Cx.CModal visible={show} size={size}>
        <Cx.CModalHeader onDismiss={() => onShowModal(false)}>
          <Cx.CModalTitle>{title}</Cx.CModalTitle>
        </Cx.CModalHeader>
        {children}
      </Cx.CModal>
    </>
  ) : null

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById('modal-root')
    )
  } else {
    return null
  }
}

export default Modal
