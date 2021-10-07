import React, { Component } from 'react'
import TableTemplate from '../../components/shared/table-template'

export class AllUsersTemplate extends Component {
  render() {
    return (
      <>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-3">
          <h1 className="col-span-2 text-2xl font-semibold text-gray-900">
            All Users
          </h1>
          <div className="text-right">
            <button
              type="button"
              className="w-1/3 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Create User
            </button>
          </div>
        </div>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Replace with your content */}
          <div className="py-4">
            <TableTemplate />
          </div>
          {/* /End replace */}
        </div>
      </>
    )
  }
}

export default AllUsersTemplate
