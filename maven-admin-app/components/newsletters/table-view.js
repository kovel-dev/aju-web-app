import React, { useMemo } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { server } from '../../lib/config/server'
import ReactTableView from '../shared/table-template'
import { getNewsletterByRef } from '../../lib/handlers/handlers'
import Newsletter from '../../lib/models/newsletter'
import ViewComponent from '../../components/form/view-builder'
import Meta from '../meta'

function TableView(props) {
  let newsletter = new Newsletter({})
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
        await getNewsletterByRef(refNumber)
          .then((value) => {
            newsletter = new Newsletter(value)
            const messages = [
              { key: 'First Name', value: newsletter.first_name },
              { key: 'Last Name', value: newsletter.last_name },
              { key: 'Email', value: newsletter.email },
              {
                key: 'Consent',
                value: newsletter.consent === 'true' ? 'true' : 'false',
              },
              { key: 'Url', value: newsletter.url },
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
        Header: 'Action',
        Cell: function ActionButtons({ row }) {
          return (
            <div>
              <a
                href={`${server}/newsletters/${row.original.ref}/view`}
                className="text-primary hover:text-primary-dark"
              >
                View
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
        Header: 'Consent',
        accessor: 'consent',
      },
      {
        Header: 'Page Url',
        accessor: 'pageurl',
      },
      {
        Header: 'Timestamp',
        accessor: 'timestamp',
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
      .get(`${server}/api/newsletters/all`)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const newsletters = []
        let counter = 0
        settotalRows(count)
        for (const key in data) {
          const newsletter = {
            id: parseInt(key) + 1,
            first_name: data[key][0],
            last_name: data[key][1],
            email: data[key][2],
            ref: data[key][5]['@ref']['id'],
            consent: data[key][1] ? 'Agree' : '',
            pageurl: data[key][4] ? data[key][4] : '',
            timestamp: data[key][6] ? data[key][6] : '',
          }

          newsletters.push(newsletter)
          counter++
          setloadCount(counter)
        }

        setdataRows(newsletters)
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
      <Meta title="Newsletters | Maven Admin" keywords="" description="" />
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
      {!isLoading && !isView && (
        <ReactTableView columns={columns} rows={dataRows} />
      )}
      {!isLoading && isView && (
        <ViewComponent name="Newsletters" messages={messages} />
      )}
    </>
  )
}

export default TableView
