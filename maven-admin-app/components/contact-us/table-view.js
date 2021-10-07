import React, { useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

import ReactTableView from '../shared/table-template'
import { server } from '../../lib/config/server'
import { getContactUsByRef } from '../../lib/handlers/handlers'
import ContactUs from '../../lib/models/contact-us'
import ViewComponent from '../../components/form/view-builder'
import Meta from '../meta'

function TableView(props) {
  let contactUs = new ContactUs({})
  const [errors, setErrors] = useState({})
  const isView = props.view ? true : false
  const [isLoading, setIsLoading] = useState(true)
  const [loadCount, setloadCount] = useState(0)
  const [dataRows, setdataRows] = useState([])
  const [totalRows, settotalRows] = useState(0)
  const [messages, setMessages] = useState([])

  const router = useRouter()

  if (isView) {
    useEffect(async () => {
      setIsLoading(true)
      const query = router.query

      if (query) {
        const refNumber = query.id
        await getContactUsByRef(refNumber)
          .then((value) => {
            contactUs = new ContactUs(value)
            const messages = [
              { key: 'Name', value: contactUs.name },
              { key: 'Email', value: contactUs.email },
              { key: 'Mobile Number', value: contactUs.mobile_number },
              { key: 'Message', value: contactUs.message },
            ]
            setMessages(messages)
            setIsLoading(false)
          })
          .catch(function (err) {
            setErrors(err.response.data)
            setIsLoading(false)
            console.log(err)
            return
          })
      }
    }, [])
  }

  const columns = useMemo(
    () => [
      // {
      //     Header: 'Ref#',
      //     accessor: 'ref',
      // },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },

      {
        Header: 'Mobile Number',
        accessor: 'mobile_number',
      },
      {
        Header: 'Action',
        Cell: function ActionButtons({ row }) {
          return (
            <div>
              <a
                href={`${server}/contact-us/${row.original.ref}/view`}
                className="text-primary hover:text-primary-dark"
              >
                View
              </a>
            </div>
          )
        },
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
      .get(`${server}/api/contact-us/all`)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const messages = []
        let counter = 0

        settotalRows(count)
        for (const key in data) {
          const message = {
            id: parseInt(key) + 1,
            name: data[key][0],
            email: data[key][1],
            mobile_number: data[key][2],
            ref: data[key][3]['@ref']['id'],
          }

          messages.push(message)
          counter++
          setloadCount(counter)
        }

        setdataRows(messages)
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
      <Meta title="Messages | Maven Admin" keywords="" description="" />
      {isLoading && (
        <div
          className={`loading-dock border-4 border-dashed border-gray-200 rounded-lg ${
            errors.length > 0 ? 'h-20' : 'h-16'
          }`}
        >
          <p className="pt-4 text-center text-gray-600">
            Loading ({loadCount}/{totalRows})
          </p>
          {errors.length > 0 && (
            <p className="pb-4 text-center text-red-600">
              Error Encountered! Something went wrong.
            </p>
          )}
        </div>
      )}
      {!isLoading && !isView && (
        <ReactTableView columns={columns} rows={dataRows} />
      )}
      {!isLoading && isView && (
        <ViewComponent name="Contact Us" messages={messages} />
      )}
    </>
  )
}

export default TableView
