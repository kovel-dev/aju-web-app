import React, { useMemo } from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { server } from '../../lib/config/server'
import ReactTableView from '../../components/shared/table-template'
import AlertModal from '../../components/shared/alert-modal'
import Meta from '../meta'

function TableView() {
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadCount, setloadCount] = useState(0)
  const [dataRows, setdataRows] = useState([])
  const [totalRows, settotalRows] = useState(0)
  const [showDeleteModal, setshowDeleteModal] = useState(false)
  const [toDeleteItem, setToDeleteItem] = useState(null)

  const showAlert = (e, ref) => {
    e.preventDefault()
    setshowDeleteModal(true)
    setToDeleteItem(ref)
  }

  const hideAlert = () => {
    setshowDeleteModal(false)
    setToDeleteItem(null)
  }

  const confirmedDeleteHandler = async () => {
    await axios
      .post(`${server}/api/promo-codes/${toDeleteItem}/deactivate`, {
        is_deleted: true,
      })
      .then(async (response) => {
        console.log('Success')
        await fetchData()
      })
      .catch((error) => {
        console.log(error)
        setErrors(error.response.data)
        setIsLoading(true)
      })

    setshowDeleteModal(false)
    setToDeleteItem(null)
  }

  const columns = useMemo(
    () => [
      // {
      //     Header: 'Ref#',
      //     accessor: 'ref',
      // },
      {
        Header: 'Action',
        Cell: function ActionButtons({ row }) {
          return (
            <div>
              <a
                href={`${server}/promo-codes/${row.original.ref}/edit`}
                className="text-primary hover:text-primary-dark"
              >
                Edit
              </a>
              <a
                href=""
                onClick={(e) => showAlert(e, row.original.ref)}
                className={`ml-3 text-red-500 hover:text-red-700 ${
                  row.original.status == 'inactive' ? 'hidden' : ''
                }`}
              >
                Inactive
              </a>
            </div>
          )
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Code',
        accessor: 'code',
      },
      {
        Header: 'Percentage',
        accessor: 'percentage',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
    ],
    []
  )

  const data = useMemo(() => dataRows, [dataRows])

  useEffect(async () => {
    //initial load page 1 and limit
    setErrors({})
    await fetchData()
  }, [])

  const fetchData = async () => {
    await axios
      .get(`${server}/api/promo-codes/all`)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const promocodes = []
        let counter = 0

        settotalRows(count)
        for (const key in data) {
          const promocode = {
            id: parseInt(key) + 1,
            name: data[key][0],
            code: data[key][1],
            percentage: data[key][3] + '%',
            status: data[key][2],
            ref: data[key][8]['@ref']['id'],
          }
          promocodes.push(promocode)
          counter++
          setloadCount(counter)
        }

        setdataRows(promocodes)
        setIsLoading(false)
      })
      .catch(function (err) {
        console.log(err)
        setErrors(err.response.result.data)
        return
      })
  }

  return (
    <>
      <Meta title="Promo Codes | Maven Admin" keywords="" description="" />
      {isLoading && (
        <div
          className={`loading-dock border-4 border-dashed border-gray-200 rounded-lg ${
            errors.length > 0 ? 'h-20' : 'h-16'
          }`}
        >
          <p className="text-center pt-4 text-gray-600">
            Loading ({loadCount}/{totalRows})
          </p>
          {errors.length > 0 && (
            <p className="text-red-600 text-center pb-4">
              Error Encountered! Something went wrong.
            </p>
          )}
        </div>
      )}
      {!isLoading && <ReactTableView columns={columns} rows={dataRows} />}
      <AlertModal
        show={showDeleteModal}
        title="Disable Promo Code"
        desc="Are you sure you want to disable this Promo Code?"
        cancelActionhandler={hideAlert}
        actionHandler={confirmedDeleteHandler}
        actionName="Disable"
      />
    </>
  )
}

export default TableView
