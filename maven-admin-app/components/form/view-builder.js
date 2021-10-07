import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { server } from '../../lib/config/server'
import User from '../../lib/models/user'
import { getOrganizationByRef } from '../../lib/handlers/handlers'

export default function ViewComponent(props) {
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [affiliationIdValue, setaffiliationIdValue] = useState()

  const router = useRouter()
  const query = router.query

  const approveHandler = async () => {
    const refNumber = query.id
    await User.approvePendingPartner(refNumber)
      .then((result) => {
        setIsLoading(true)
        return router.replace(`${server}/pending-partners`)
      })
      .catch(function (err) {
        setErrors(err)
        setIsLoading(false)
        console.log(err)
        return
      })
  }

  const rejectHandler = async () => {
    const refNumber = query.id
    await User.rejectPendingPartner(refNumber)
      .then((result) => {
        setIsLoading(true)
        return router.replace(`${server}/pending-partners`)
      })
      .catch(function (err) {
        setErrors(err)
        setIsLoading(false)
        console.log(err)
        return
      })
  }
  return (
    <>
      {isLoading && (
        <div
          className={`loading-dock border-4 border-dashed border-gray-200 rounded-lg ${
            errors.length > 0 ? 'h-20' : 'h-16'
          }`}
        >
          <p className="text-center pt-4 text-gray-600">Loading</p>
          {errors.length > 0 && (
            <p className="text-red-600 text-center pb-4">
              Error Encountered! Something went wrong.
            </p>
          )}
        </div>
      )}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {props.name} Information
          </h3>
          {props.name === 'Pending Partner' && (
            <div className="mt-3 flex sm:mt-0 sm:ml-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={approveHandler}
              >
                Approve
              </button>
              <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={rejectHandler}
              >
                Reject
              </button>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200">
          {props.messages.map((message, key) => (
            <dl key={key}>
              <div
                className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${
                  key % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <dt className="text-sm font-medium text-gray-500">
                  {message.key}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {message.value?.charAt(0).toUpperCase() +
                    message.value?.slice(1)}
                </dd>
              </div>
            </dl>
          ))}
        </div>
      </div>
    </>
  )
}
