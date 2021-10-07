import React, { useMemo } from 'react'
import { useEffect, useState } from 'react'
import { server } from '../../lib/config/server'
import ReactTableView from '../../components/shared/table-template'
import Meta from '../meta'

function TableView() {
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loadCount, setloadCount] = useState(0)
  const [dataRows, setdataRows] = useState([])
  const [totalRows, settotalRows] = useState(0)

  const columns = useMemo(
    () => [
      {
        Header: 'Page Name',
        accessor: 'name',
      },
      {
        Header: 'Action',
        Cell: function ActionButtons({ row }) {
          return (
            <div>
              <a
                href={`${server}/pages-and-settings/${row.original.key}`}
                className="text-primary hover:text-primary-dark"
              >
                Edit
              </a>
            </div>
          )
        },
      },
    ],
    []
  )

  const data = useMemo(
    () => [
      { name: 'Home', key: 'home' },
      { name: 'Faq', key: 'faq' },
    ],
    []
  )

  useEffect(async () => {
    //initial load page 1 and limit
    setErrors({})
    setdataRows(data)
  }, [])

  return (
    <>
      <Meta
        title="Pages and Settings | Maven Admin"
        keywords=""
        description=""
      />
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
    </>
  )
}

export default TableView
