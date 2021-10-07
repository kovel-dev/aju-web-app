import axios from 'axios'
import ReactTableView from '../shared/table-template'
import PartnerRequest from '../../lib/models/partner-request'
import ViewComponent from '../../components/form/view-builder'
import React, { useMemo } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { server } from '../../lib/config/server'
import { getPartnerReqByRef } from '../../lib/handlers/handlers'
import Notification from '../shared/notification'
import Meta from '../meta'

function TableView(props) {
  let partnerReq = new PartnerRequest({})
  const [errors, setErrors] = useState({})
  const isView = props.view ? true : false
  const [isLoading, setIsLoading] = useState(true)
  const [loadCount, setloadCount] = useState(0)
  const [dataRows, setdataRows] = useState([])
  const [totalRows, settotalRows] = useState(0)
  const [messages, setMessages] = useState([])
  const [modelStatus, setModelStatus] = useState('open')
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState({
    variant: '',
    msg: '',
  })
  const data = useMemo(() => dataRows, [dataRows])
  const router = useRouter()

  useEffect(async () => {
    //initial load page 1 and limit
    setErrors({})
    await fetchData()
  }, [])

  if (isView) {
    useEffect(async () => {
      setIsLoading(true)
      const query = router.query

      if (query) {
        const refNumber = query.id
        let addOnTypes = partnerReq.getAddOnTypes()
        await getPartnerReqByRef(refNumber)
          .then((value) => {
            partnerReq = new PartnerRequest(value)
            let addOnType = addOnTypes[partnerReq.add_on]
            const messages = [
              { key: 'Add On', value: addOnType },
              { key: 'Name', value: partnerReq.name },
              { key: 'Seats Reserved', value: partnerReq.seats_reserved },
              { key: 'Details', value: partnerReq.details },
              { key: 'Organization', value: partnerReq.organization },
              { key: 'Email', value: partnerReq.contact_email },
              { key: 'Phone', value: partnerReq.phone },
              {
                key: 'Is Phone Call Preferred?',
                value: partnerReq.prefer_phone ? 'Yes' : 'No',
              },
              { key: 'Status', value: partnerReq.status },
              { key: 'Link', value: partnerReq.link },
              { key: 'Event Name', value: partnerReq.event_name },
              { key: 'Date Created', value: partnerReq.created_at },
            ]
            setModelStatus(partnerReq.status)
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
                href={`${server}/partner-requests/${row.original.ref}/view`}
                className="text-primary hover:text-primary-dark"
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
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Add On',
        accessor: 'add_on',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Date Created',
        accessor: 'created_at',
      },
    ],
    []
  )

  const fetchData = async () => {
    await axios
      .get(`${server}/api/partner-requests/all`)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const partnerReqs = []
        let counter = 0
        let addOnTypes = partnerReq.getAddOnTypes()
        let statusTypes = partnerReq.getStatus()

        settotalRows(count)
        for (const key in data) {
          let addOnType = addOnTypes[data[key][0]]
          let statusType = statusTypes[data[key][8]]

          const partnerReqData = {
            id: parseInt(key) + 1,
            name: data[key][1],
            email: data[key][6],
            add_on: addOnType,
            status: statusType,
            created_at: data[key][12],
            ref: data[key][16]['@ref']['id'],
          }

          partnerReqs.push(partnerReqData)
          counter++
          setloadCount(counter)
        }

        setdataRows(partnerReqs)
        setIsLoading(false)
      })
      .catch(function (err) {
        console.log(err)
        setErrors(err.response.result.data)
        return
      })
  }

  const updateStatus = async (status) => {
    setShowNotification(false)
    let addOnTypes = partnerReq.getAddOnTypes()

    await axios
      .post(`${server}/api/partner-requests/update`, {
        status: status,
        refId: router.query.id,
      })
      .then((value) => {
        partnerReq = new PartnerRequest(value.data)
        let addOnType = addOnTypes[partnerReq.add_on]
        const messages = [
          { key: 'Add On', value: addOnType },
          { key: 'Name', value: partnerReq.name },
          { key: 'Seats Reserved', value: partnerReq.seats_reserved },
          { key: 'Details', value: partnerReq.details },
          { key: 'Organization', value: partnerReq.organization },
          { key: 'Email', value: partnerReq.contact_email },
          { key: 'Phone', value: partnerReq.phone },
          {
            key: 'Is Phone Call Preferred?',
            value: partnerReq.prefer_phone ? 'Yes' : 'No',
          },
          { key: 'Status', value: partnerReq.status },
          { key: 'Link', value: partnerReq.link },
          { key: 'Event Name', value: partnerReq.event_name },
          { key: 'Date Created', value: partnerReq.created_at },
        ]
        setModelStatus(partnerReq.status)
        setMessages(messages)
        setIsLoading(false)
        setShowNotification(true)
        setNotificationMsg({
          variant: 'success',
          msg: 'Updated successfully',
        })
      })
      .catch(function (err) {
        setErrors(err.response.data)
        setIsLoading(false)
        console.log(err)
        return
      })
  }

  const closeNotification = () => {
    setShowNotification(false)
  }

  return (
    <>
      <Meta title="Partner Requests | Maven Admin" keywords="" description="" />
      {showNotification && (
        <Notification
          variant={notificationMsg.variant}
          msg={notificationMsg.msg}
          closeHandler={closeNotification}
        />
      )}
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
        <>
          <ViewComponent name="Partner Requests" messages={messages} />
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Change Status
            </h3>
            <div className="mt-3 flex sm:mt-0 sm:ml-4">
              {modelStatus !== 'open' && (
                <button
                  type="button"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => updateStatus('open')}
                >
                  Open
                </button>
              )}
              {modelStatus !== 'in-progress' && (
                <button
                  type="button"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => updateStatus('in-progress')}
                >
                  In Progress
                </button>
              )}
              {modelStatus !== 'completed' && (
                <button
                  type="button"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => updateStatus('completed')}
                >
                  Completed
                </button>
              )}
              <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-grey-600 hover:bg-grey-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-grey-500"
                onClick={() => router.push('/partner-requests')}
              >
                Go Back to List
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default TableView
