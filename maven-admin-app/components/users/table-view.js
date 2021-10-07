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
      .post(`${server}/api/users/${toDeleteItem}/deactivate`, {
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
                href={`${server}/users/${row.original.ref}/edit`}
                className="text-primary hover:text-primary-dark"
              >
                Edit
              </a>
              <a
                href=""
                onClick={(e) => showAlert(e, row.original.ref)}
                className="ml-3 text-red-500 hover:text-red-700"
              >
                Delete
              </a>
            </div>
          )
        },
      },
      {
        Header: 'First Name',
        accessor: 'first_name',
      },
      {
        Header: 'Last Name',
        accessor: 'last_name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Verified',
        accessor: 'is_verified',
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
      .get(`${server}/api/users/all`)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const users = []
        let counter = 0

        settotalRows(count)
        for (const key in data) {
          const user = {
            id: parseInt(key) + 1,
            first_name: data[key][0],
            last_name: data[key][1],
            email: data[key][2],
            role: data[key][3].toUpperCase(),
            status: data[key][4].toUpperCase(),
            is_verified: data[key][5] ? 'Yes' : 'Not Yet',
            ref: data[key][7]['@ref']['id'],
          }

          users.push(user)
          counter++
          setloadCount(counter)
        }

        setdataRows(users)
        setIsLoading(false)
      })
      .catch(function (err) {
        if (err.response) {
          // Request made and server responded
          // console.log(err.response.data);
          // console.log(err.response.status);
          // console.log(err.response.headers);
          setErrors(err.response.data)
        } else if (err.request) {
          // The request was made but no response was received
          setErrors(err.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          setErrors(err.message)
        }
        console.log(err)
        return
      })
  }

  return (
    <>
      <Meta title="Users | Maven Admin" keywords="" description="" />
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
        title="Delete Account"
        desc="Are you sure you want to delete this account? Account will be removed from the view and can only be recovered by support team on special request. This account will not be able to sign-in anywhere."
        cancelActionhandler={hideAlert}
        actionHandler={confirmedDeleteHandler}
        actionName="Delete"
      />
    </>
  )
}

export default TableView
