import React, { useMemo } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { server } from '../../lib/config/server'
import ReactTableView from '../shared/table-template'
import { getUserByRefHandler } from '../../lib/handlers/handlers'
import User from '../../lib/models/user'
import ViewComponent from '../../components/form/view-builder'
import Meta from '../meta'

function TableView(props) {
  let user = new User({})
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
        await getUserByRefHandler(refNumber)
          .then((value) => {
            user = new User(value)
            const messages = [
              { key: 'First Name', value: user.first_name },
              { key: 'Last Name', value: user.last_name },
              { key: 'Email', value: user.email },
              { key: 'Mobile Number', value: user.mobile_number },
              { key: 'Affiliation Name', value: user.affiliation_name },
              { key: 'Affiliation Other', value: user.affiliation_other },
              { key: 'Country', value: user.country },
              { key: 'State', value: user.state },
              { key: 'City', value: user.city },
              { key: 'TimeZone', value: user.timezone },
              { key: 'Communication Method', value: user.communication_method },
              {
                key: 'Communication Language',
                value: user.communication_language,
              },
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
                href={`${server}/pending-partners/${row.original.ref}/view`}
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
        Header: 'Organization Name',
        accessor: 'affiliation_name',
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
    await User.getPendingPartnerUsers()
      .then((response) => {
        const data = response.data
        const count = data.length
        const messages = []
        let counter = 0

        settotalRows(count)
        for (const key in data) {
          const message = {
            id: parseInt(key) + 1,
            first_name: data[key].first_name,
            last_name: data[key].last_name,
            email: data[key].email,
            affiliation_name: data[key].affiliation_name,
            ref: data[key].ref,
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
      <Meta title="Pending Partners | Maven Admin" keywords="" description="" />
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
        <ViewComponent name="Pending Partner" messages={messages} />
      )}
    </>
  )
}

export default TableView
