import React from 'react'

export default function OrderItemsComponent(props) {
  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Order Items
          </h3>
        </div>
        {props.items.map((item, key) => (
          <div key={key}>
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50 sm:flex sm:items-center sm:justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                ({key + 1}) Program: {item.title}
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div
                  className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white`}
                >
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {item.price}
                  </dd>
                </div>
                <div
                  className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50`}
                >
                  <dt className="text-sm font-medium text-gray-500">
                    Quantity
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {item.quantity}
                  </dd>
                </div>

                <div
                  className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white`}
                >
                  <dt className="text-sm font-medium text-gray-500">Total</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {item.total}
                  </dd>
                </div>
                <div
                  className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50`}
                >
                  <dt className="text-sm font-medium text-gray-500">
                    Added To Cart At
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {item.createdAt}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
