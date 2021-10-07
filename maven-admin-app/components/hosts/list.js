import * as Cx from '@coreui/react'
import Pagination from '../shared/pagination'
import Host from '../../lib/models/host'
import Modal from '../shared/modal'
import { useEffect, useState } from 'react'
import { hasError, getErrorMessage } from '../../lib/validations/validations'
import { useRouter } from 'next/router'
import { server } from '../../lib/config/server'

function ListOfHosts() {
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [hostList, setHostList] = useState([])

  // for change status
  const [showModal, setShowModal] = useState(false)
  const [toChangeStatusItem, setToChangeStatusItem] = useState(null)
  const [statusChange, setStatusChange] = useState(null)

  // for Pagination
  const [totalItems, setTotalItems] = useState(0)
  const [numOfItemsPerPage, setNumOfItemsPerPage] = useState(10)

  let host = new Host({})

  useEffect(async () => {
    setErrors({})
    setIsLoading(true)
    await updatePage(1, numOfItemsPerPage)
  }, [])

  const buttonHandler = (ref, type) => {
    setIsLoading(true)
    if (type == 'edit') {
      router.push(`${server}/hosts/${ref}/edit`)
    } else if (type == 'inactive' || type == 'active') {
      setShowModal(true)
      setToChangeStatusItem(ref)
      setStatusChange(type)
    }
  }

  const modalCloseHandler = () => {
    setShowModal(false)
    setIsLoading(false)
  }

  const confirmedChangeStatusHandler = async () => {
    setIsLoading(true)
    setShowModal(false)

    try {
      if (statusChange == 'active') {
        await host.activate(toChangeStatusItem).then(async (response) => {
          setIsLoading(false)
          setToChangeStatusItem(null)
          setStatusChange(null)
          await updatePage(1, numOfItemsPerPage)
        })
      } else {
        await host.deactivate(toChangeStatusItem).then(async (response) => {
          setIsLoading(false)
          setToChangeStatusItem(null)
          setStatusChange(null)
          await updatePage(1, numOfItemsPerPage)
        })
      }
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
      setToChangeStatusItem(null)
      setStatusChange(null)
    }
  }

  const updatePage = async (newPage, limit) => {
    setErrors({})
    setIsLoading(true)
    await host
      .getList(newPage, limit)
      .then((response) => {
        setIsLoading(false)
        setHostList(response.data)
        setTotalItems(response.count)
      })
      .catch((error) => {
        setErrors(error)
        setIsLoading(false)
      })
  }

  return (
    <div className="container-fluid mt-5">
      {isLoading && (
        <div className="text-center mt-5">
          <Cx.CSpinner component="span" size="sm" /> Loading...
        </div>
      )}
      {hasError(errors, 'general') && (
        <Cx.CCallout color="danger">
          {getErrorMessage(errors, 'general')}
        </Cx.CCallout>
      )}
      <div className="d-grid gap-2 d-md-flex justify-content-md-end my-2">
        <Cx.CButton href={`${server}/hosts/create`} disabled={isLoading}>
          Create Host
        </Cx.CButton>
      </div>
      <Cx.CCard className="w-auto ">
        <Cx.CCardHeader>List of Hosts</Cx.CCardHeader>
        <Cx.CCardBody>
          <Cx.CTable>
            <Cx.CTableHead>
              <Cx.CTableRow>
                <Cx.CTableHeaderCell scope="col">Name</Cx.CTableHeaderCell>
                <Cx.CTableHeaderCell scope="col">Status</Cx.CTableHeaderCell>
                <Cx.CTableHeaderCell scope="col">Actions</Cx.CTableHeaderCell>
              </Cx.CTableRow>
            </Cx.CTableHead>
            <Cx.CTableBody>
              {hostList.map((host, index) => {
                return (
                  <Cx.CTableRow key={index}>
                    <Cx.CTableDataCell>{host.name}</Cx.CTableDataCell>
                    <Cx.CTableDataCell>{host.status}</Cx.CTableDataCell>
                    <Cx.CTableDataCell>
                      <Cx.CButton
                        color="secondary"
                        onClick={() => buttonHandler(host.ref, 'edit')}
                        disabled={isLoading}
                      >
                        Edit
                      </Cx.CButton>
                      {host.status == 'ACTIVE' && (
                        <Cx.CButton
                          color="danger"
                          onClick={() => buttonHandler(host.ref, 'inactive')}
                          disabled={isLoading}
                        >
                          Deactivate
                        </Cx.CButton>
                      )}
                      {host.status == 'INACTIVE' && (
                        <Cx.CButton
                          color="success"
                          onClick={() => buttonHandler(host.ref, 'active')}
                          disabled={isLoading}
                        >
                          Activate
                        </Cx.CButton>
                      )}
                    </Cx.CTableDataCell>
                  </Cx.CTableRow>
                )
              })}
            </Cx.CTableBody>
          </Cx.CTable>
          <Pagination
            numOfItemsPerPage={parseInt(numOfItemsPerPage)}
            onClickPage={updatePage}
            totalItems={totalItems}
          />
        </Cx.CCardBody>
      </Cx.CCard>
      <Modal
        title={
          statusChange == 'active'
            ? 'Activate Confirmation'
            : 'Deactivate Confirmation'
        }
        show={showModal}
        onShowModal={modalCloseHandler}
      >
        <Cx.CModalBody>
          Are you sure you want to{' '}
          {statusChange == 'active' ? 'activate' : 'deactivate'}?
        </Cx.CModalBody>
        <Cx.CModalFooter>
          <Cx.CButton color="secondary" onClick={() => modalCloseHandler()}>
            Close
          </Cx.CButton>
          <Cx.CButton
            color={statusChange == 'active' ? 'success' : 'danger'}
            onClick={() => confirmedChangeStatusHandler()}
          >
            {statusChange == 'active' ? 'Activate' : 'Deactivate'}
          </Cx.CButton>
        </Cx.CModalFooter>
      </Modal>
    </div>
  )
}

export default ListOfHosts
