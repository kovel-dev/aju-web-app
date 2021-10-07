import * as Cx from '@coreui/react'
import Pagination from '../shared/pagination'
import Product from '../../lib/models/product'
import { server } from '../../lib/config/server'
import { useEffect, useState } from 'react'
import { hasError, getErrorMessage } from '../../lib/validations/validations'
import { useRouter } from 'next/router'

function ListOfProducts() {
  const [errors, setErrors] = useState({})
  const [productList, setProductList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // for Pagination
  const [totalItems, setTotalItems] = useState(0)
  const [numOfItemsPerPage, setNumOfItemsPerPage] = useState(10)

  const router = useRouter()
  let product = new Product({})

  useEffect(async () => {
    setErrors({})
    setIsLoading(true)
    await updatePage(1, numOfItemsPerPage)
  }, [])

  const buttonHandler = (ref, type) => {
    if (type == 'edit') {
      setIsLoading(true)
      router.push(`${server}/products/${ref}/edit`)
    } else if (type == 'view') {
      setIsLoading(true)
      router.push(`${server}/products/${ref}/view`)
    }
  }

  const updatePage = async (newPage, limit) => {
    setErrors({})
    setIsLoading(true)
    await product
      .getList(newPage, limit)
      .then((response) => {
        setIsLoading(false)
        setProductList(response.data)
        setTotalItems(response.count)
      })
      .catch((error) => {
        setErrors(error.response.data)
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
        <Cx.CButton href={`${server}/products/create`}>
          Create Product
        </Cx.CButton>
      </div>
      <Cx.CCard className="w-auto ">
        <Cx.CCardHeader>List of Products</Cx.CCardHeader>
        <Cx.CCardBody>
          <Cx.CTable>
            <Cx.CTableHead>
              <Cx.CTableRow>
                <Cx.CTableHeaderCell scope="col">Name</Cx.CTableHeaderCell>
                <Cx.CTableHeaderCell scope="col">Type</Cx.CTableHeaderCell>
                <Cx.CTableHeaderCell scope="col">
                  Delivery Type
                </Cx.CTableHeaderCell>
                <Cx.CTableHeaderCell scope="col">Status</Cx.CTableHeaderCell>
                <Cx.CTableHeaderCell scope="col">Level</Cx.CTableHeaderCell>
                <Cx.CTableHeaderCell scope="col">
                  Published Start Date
                </Cx.CTableHeaderCell>
                <Cx.CTableHeaderCell scope="col">
                  Published End Date
                </Cx.CTableHeaderCell>
                <Cx.CTableHeaderCell scope="col">
                  Registration Start Date
                </Cx.CTableHeaderCell>
                <Cx.CTableHeaderCell scope="col">
                  Registration End Date
                </Cx.CTableHeaderCell>
                <Cx.CTableHeaderCell scope="col">Actions</Cx.CTableHeaderCell>
              </Cx.CTableRow>
            </Cx.CTableHead>
            <Cx.CTableBody>
              {productList.map((product, index) => {
                return (
                  <Cx.CTableRow key={index}>
                    <Cx.CTableDataCell>{product.name}</Cx.CTableDataCell>
                    <Cx.CTableDataCell>{product.type}</Cx.CTableDataCell>
                    <Cx.CTableDataCell>
                      {product.delivery_type}
                    </Cx.CTableDataCell>
                    <Cx.CTableDataCell>{product.status}</Cx.CTableDataCell>
                    <Cx.CTableDataCell>{product.level}</Cx.CTableDataCell>
                    <Cx.CTableDataCell>{product.start_dt}</Cx.CTableDataCell>
                    <Cx.CTableDataCell>{product.end_dt}</Cx.CTableDataCell>
                    <Cx.CTableDataCell>
                      {product.reg_start_dt}
                    </Cx.CTableDataCell>
                    <Cx.CTableDataCell>{product.reg_end_dt}</Cx.CTableDataCell>
                    <Cx.CTableDataCell>
                      <Cx.CButton
                        color="secondary"
                        onClick={() => buttonHandler(product.ref, 'edit')}
                        disabled={isLoading}
                      >
                        Edit
                      </Cx.CButton>
                      <Cx.CButton
                        onClick={() => buttonHandler(product.ref, 'view')}
                        disabled={isLoading}
                      >
                        View
                      </Cx.CButton>
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
    </div>
  )
}

export default ListOfProducts
