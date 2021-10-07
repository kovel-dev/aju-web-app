import axios from 'axios'
import ReactTableView from '../shared/table-template'
import ViewComponent from '../../components/form/view-builder'
import OrderItemsComponent from '../form/order-item-builder'
import PromoCodesUsedComponent from '../form/promo-code-used-builder'

import React, { useMemo } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { server } from '../../lib/config/server'
import { getOrderReqByRef } from '../../lib/handlers/handlers'
import Meta from '../meta'

function TableView(props) {
  const [errors, setErrors] = useState({})
  const isView = props.view ? true : false
  const [isLoading, setIsLoading] = useState(true)
  const [loadCount, setloadCount] = useState(0)
  const [dataRows, setdataRows] = useState([])
  const [totalRows, settotalRows] = useState(0)
  const [messages, setMessages] = useState([])
  const [orderItems, setOrderItems] = useState([])
  const [promoCodeItems, setPromoCodeItems] = useState([])
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
        await getOrderReqByRef(refNumber)
          .then((order) => {
            setOrderItems(order.items)
            setPromoCodeItems(order.promoUsedMeta)

            const messages = [
              { key: 'Order Number', value: order.id.toString() },
              {
                key: 'Transaction Id (Stripe)',
                value: order.transactionId || '',
              },
              { key: 'Order By', value: order.created_by_name },
              { key: 'Date Created', value: order.formatted_created_at },
              { key: 'Price', value: order.price.toString() },
              { key: 'Discount', value: order.discount.toString() },
              { key: 'Sub Total', value: order.subtotal.toString() },
              { key: 'Total', value: order.total.toString() },
              { key: 'Status', value: order.status },
              { key: 'Slug', value: order.slug.toString() },
              {
                key: 'Subscribe to Newsletter',
                value: order.isSubscribe ? 'Yes' : 'No',
              },
              {
                key: 'Email Sent Status',
                value: order.isEmailSent ? 'Sent' : 'Failed',
              },
              {
                key: 'Promo Code Generated',
                value: order.promoGeneratedMeta.join(', ') || 'None',
              },
            ]
            setMessages(messages)
            setIsLoading(false)
          })
          .catch(function (err) {
            setErrors(err.response.data)
            setIsLoading(false)
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
                href={`${server}/orders/${row.original.ref}/view`}
                className="text-primary hover:text-primary-dark"
              >
                View
              </a>
            </div>
          )
        },
      },
      {
        Header: 'Order Number',
        accessor: 'ref',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Order By',
        accessor: 'order_by_name',
      },
      {
        Header: 'Order At',
        accessor: 'created_at',
      },
    ],
    []
  )

  const fetchData = async () => {
    await axios
      .get(`${server}/api/orders/all`)
      .then((response) => {
        const data = response.data.result
        const count = response.data.count
        const orders = []
        let counter = 0

        settotalRows(count)
        for (const key in data) {
          const orderData = {
            id: parseInt(key) + 1,
            ref: data[key][20]['@ref']['id'],
            status: data[key][11].toUpperCase(),
            order_by_name: data[key][21],
            created_at: data[key][22],
          }

          orders.push(orderData)
          counter++
          setloadCount(counter)
        }

        setdataRows(orders)
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
      <Meta title="Orders | Maven Admin" keywords="" description="" />
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
          <ViewComponent name="Order" messages={messages} />
          <div className="mt-3 w-full">
            <OrderItemsComponent items={orderItems} />
          </div>
          {promoCodeItems.length > 0 && (
            <div className="mt-3 w-full">
              <PromoCodesUsedComponent items={promoCodeItems} />
            </div>
          )}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
            <div className="mt-3 flex sm:mt-0 sm:ml-4">
              <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-grey-600 hover:bg-grey-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-grey-500"
                onClick={() => router.push('/orders')}
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
