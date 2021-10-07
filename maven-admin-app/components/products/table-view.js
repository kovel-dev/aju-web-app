import React, { useMemo } from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { server } from '../../lib/config/server'
import ReactTableView from '../../components/shared/table-template'
import moment from 'moment'
import Meta from '../meta'

function TableView(props) {
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadCount, setloadCount] = useState(0)
  const [dataRows, setdataRows] = useState([])
  const [totalRows, settotalRows] = useState(0)

  const WEB_URL = process.env.NEXT_PUBLIC_FRONTEND_API_URL

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
                href={`${server}/products/${row.original.ref}/edit`}
                className="text-primary hover:text-primary-dark"
              >
                Edit
              </a>
              <a
                href={`${server}/products/${row.original.ref}/view`}
                className="text-primary hover:text-primary-dark ml-3"
              >
                View
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
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Link',
        Cell: function Link({ row }) {
          return (
            <div>
              <a
                target="_blank"
                href={row.original.link}
                className="text-primary hover:text-primary-dark"
                rel="noreferrer"
              >
                Web Link
              </a>
            </div>
          )
        },
        accessor: 'link',
      },
      {
        Header: 'Start Date (PT)',
        accessor: 'start_date',
      },
      {
        Header: 'End Date (PT)',
        accessor: 'end_date',
      },
      {
        Header: 'Registration Start Date (PT)',
        accessor: 'registration_start_date',
      },
      {
        Header: 'Registration End Date (PT)',
        accessor: 'registration_end_date',
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
    let fetchUrl = `${server}/api/products/all`

    if (props.archives) {
      fetchUrl = `${server}/api/products/archives`
    }

    await axios
      .get(fetchUrl)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const products = []
        const dateFormat = 'Do MMM YYYY h:mm a'
        let counter = 0

        settotalRows(count)
        for (const key in data) {
          const product = {
            id: parseInt(key) + 1,
            name: data[key][0],
            type: data[key][1],
            status: data[key][3],
            start_date: data[key][5]
              ? moment(data[key][5]).format(dateFormat)
              : '',
            end_date: data[key][6]
              ? moment(data[key][6]).format(dateFormat)
              : '',
            registration_start_date: data[key][7]
              ? moment(data[key][7]).format(dateFormat)
              : '',
            registration_end_date: data[key][8]
              ? moment(data[key][8]).format(dateFormat)
              : '',
            ref: data[key][9]['@ref']['id'],
            link: WEB_URL + '/events-classes/program/' + data[key][10],
          }
          products.push(product)
          counter++
          setloadCount(counter)
        }

        setdataRows(products)
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
      <Meta title="Programs | Maven Admin" keywords="" description="" />
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
