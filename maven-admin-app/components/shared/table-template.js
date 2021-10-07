import React, { Component, useMemo } from 'react'
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table'
import { CSVLink } from 'react-csv'

import GlobalFilter from './global-filter'

const csvData = [
  ['firstname', 'lastname', 'email'],
  ['Ahmed', 'Tomi', 'ah@smthing.co.com'],
  ['Raed', 'Labes', 'rl@smthing.co.com'],
  ['Yezzi', 'Min l3b', 'ymin@cocococo.com'],
]

export default function TableTemplate(props) {
  let rowData = []
  let columns = []

  if (props.columns && props.rows) {
    rowData = props.rows
    columns = props.columns
  } else {
    //Demo Data
    rowData = useMemo(
      () => [
        {
          name: 'Jane Cooper',
          title: 'Regional Paradigm Technician',
          role: 'Admin',
          email: 'jane.cooper@example.com',
        },
        {
          name: 'Cody Fisher',
          title: 'Product Directives Officer',
          role: 'Owner',
          email: 'cody.fisher@example.com',
        },
        {
          name: 'A Jane Cooper',
          title: 'Regional Paradigm Technician',
          role: 'Admin',
          email: 'ajane.cooper@example.com',
        },
        {
          name: 'B Cody Fisher',
          title: 'Product Directives Officer',
          role: 'Owner',
          email: 'bcody.fisher@example.com',
        },
        {
          name: 'C Jane Cooper',
          title: 'Regional Paradigm Technician',
          role: 'Admin',
          email: 'cjane.cooper@example.com',
        },
        {
          name: 'D Cody Fisher',
          title: 'Product Directives Officer',
          role: 'Owner',
          email: 'dcody.fisher@example.com',
        },
        {
          name: 'E Jane Cooper',
          title: 'Regional Paradigm Technician',
          role: 'Admin',
          email: 'ejane.cooper@example.com',
        },
        {
          name: 'F Cody Fisher',
          title: 'Product Directives Officer',
          role: 'Owner',
          email: 'fcody.fisher@example.com',
        },
        {
          name: 'G Jane Cooper',
          title: 'Regional Paradigm Technician',
          role: 'Admin',
          email: 'gjane.cooper@example.com',
        },
        {
          name: 'H Cody Fisher',
          title: 'Product Directives Officer',
          role: 'Owner',
          email: 'hcody.fisher@example.com',
        },
        {
          name: 'I Jane Cooper',
          title: 'Regional Paradigm Technician',
          role: 'Admin',
          email: 'ijane.cooper@example.com',
        },
        {
          name: 'J Cody Fisher',
          title: 'Product Directives Officer',
          role: 'Owner',
          email: 'jcody.fisher@example.com',
        },
      ],
      []
    )

    columns = useMemo(
      () => [
        {
          Header: 'Name',
          accessor: 'name', // accessor is the "key" in the data
        },
        {
          Header: 'Title',
          accessor: 'title',
        },
        {
          Header: 'Role',
          accessor: 'role',
        },
        {
          Header: 'Email',
          accessor: 'email',
        },
        {
          Header: 'Action',
          Cell: function ActionButtons({ row }) {
            return (
              <div>
                <a
                  href={row.original.email}
                  className="text-primary hover:text-primary-dark"
                >
                  Edit
                </a>
                <a
                  href={row.original.email}
                  className="ml-3 text-red-500 hover:text-red-700"
                >
                  Delete
                </a>
              </div>
            )
          },
        },
      ],
      []
    )
  }

  const tableInstance = useTable(
    {
      columns,
      data: rowData,
      initialState: {
        sortBy: props.defaultSortBy ? props.defaultSortBy : [],
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    state,
    setGlobalFilter,
    prepareRow,
  } = tableInstance

  const { globalFilter } = state
  const { pageIndex, pageSize } = state

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="flex justify-between">
            <div className="flex-1">
              <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            </div>
            <CSVLink data={rowData} filename="export.csv">
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Export
              </button>
            </CSVLink>
          </div>
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-t-lg">
            <table
              className="min-w-full divide-y divide-gray-200"
              {...getTableProps()}
            >
              <thead className="bg-primary text-white">
                {
                  // Loop over the header rows
                  headerGroups.map((headerGroup) => (
                    // Apply the header row props
                    // eslint-disable-next-line react/jsx-key
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {
                        // Loop over the headers in each row
                        headerGroup.headers.map((column) => (
                          // Apply the header cell props
                          // eslint-disable-next-line react/jsx-key
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase"
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                          >
                            {
                              // Render the header
                              column.render('Header')
                            }
                            <span className="inline-block align-bottom">
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )
                              ) : (
                                ''
                              )}
                            </span>
                          </th>
                        ))
                      }
                    </tr>
                  ))
                }
              </thead>
              <tbody {...getTableBodyProps()}>
                {
                  // Loop over the table rows
                  page.map((row, index) => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                      // Apply the row props
                      // eslint-disable-next-line react/jsx-key
                      <tr
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-200'}
                        {...row.getRowProps()}
                      >
                        {
                          // Loop over the rows cells
                          row.cells.map((cell) => {
                            // Apply the cell props
                            return (
                              // eslint-disable-next-line react/jsx-key
                              <td
                                className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
                                {...cell.getCellProps()}
                              >
                                {
                                  // Render the cell contents
                                  cell.render('Cell')
                                }
                              </td>
                            )
                          })
                        }
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          <nav
            className="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200 sm:px-6 sm:rounded-b-lg"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{pageIndex + 1}</span> of{' '}
                <span className="font-medium">{pageOptions.length}</span>
              </p>
            </div>
            <div className="flex justify-between flex-1 sm:justify-center">
              <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className={`${
                  !canPreviousPage
                    ? 'cursor-not-allowed bg-gray-300'
                    : 'hover:bg-gray-50'
                } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white`}
              >
                {'<<'}
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className={`${
                  !canPreviousPage
                    ? 'cursor-not-allowed bg-gray-300'
                    : 'hover:bg-gray-50'
                } ml-1 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white`}
              >
                Previous
              </button>
              <input
                type="number"
                value={pageIndex + 1}
                className="block ml-3 text-center w-20 sm:text-md p-1.5 px-2.5 border-gray-300 rounded-sm"
                onChange={(e) => {
                  const pageNumber = e.target.value
                    ? Number(e.target.value) - 1
                    : 0
                  gotoPage(pageNumber)
                }}
              />
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className={`${
                  !canNextPage
                    ? 'cursor-not-allowed bg-gray-300'
                    : 'hover:bg-gray-50'
                } ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white`}
              >
                Next
              </button>
              <button
                onClick={() => nextPage(pageCount - 1)}
                disabled={!canNextPage}
                className={`${
                  !canNextPage
                    ? 'cursor-not-allowed bg-gray-300'
                    : 'hover:bg-gray-50'
                } ml-1 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white`}
              >
                {'>>'}
              </button>
            </div>
            <div className="hidden sm:block">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm"
              >
                {[10, 25, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
