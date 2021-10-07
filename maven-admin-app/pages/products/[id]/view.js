import Loader from '../../../components/loader'
import ViewComponent from '../../../components/form/view-builder'
import ReactTableView from '../../../components/shared/table-template'
import axios from 'axios'
import { getSession } from 'next-auth/client'
import { server } from '../../../lib/config/server'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { getProgramByRef } from '../../../lib/handlers/handlers'
import QuestionAnswerPopup from '../../../components/popup/question-answer'
import Meta from '../../../components/meta'
import moment from 'moment'

function ViewProductPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState({})
  const [errors, setErrors] = useState({})
  const [dataRows, setdataRows] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [viewQandAId, setViewQandAId] = useState()
  const router = useRouter()

  const [programEndDt, setProgramEndDt] = useState('')
  const [type, setType] = useState('')

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
              <button
                className="text-primary hover:text-primary-dark"
                onClick={() => {
                  viewQAndA(row.original.ref)
                }}
              >
                View Q&A
              </button>
            </div>
          )
        },
      },
      {
        Header: 'Attendee Ref Id',
        accessor: 'ref',
      },
      {
        Header: 'Attendee',
        accessor: 'name',
      },
      {
        Header: 'Added At',
        accessor: 'created_at',
      },
    ],
    []
  )

  useEffect(() => {
    getProgramProfile()
    getAttendees()
  }, [])

  const viewQAndA = (attendeeId) => {
    setViewQandAId(attendeeId)
    setOpenPopup(true)
  }

  const getAttendees = async () => {
    setIsLoading(true)
    const query = router.query

    if (query) {
      const refNumber = query.id
      await axios
        .post(`${server}/api/attendees/all`, {
          productId: refNumber,
        })
        .then((response) => {
          const data = response.data.result
          const attendees = []

          // { field: ['data', 'created_at'], reverse: true  }, // 0
          // { field: ['data', 'orderId'] }, // 1
          // { field: ['data', 'productId'] }, // 2
          // { field: ['data', 'userId'] }, // 3
          // { field: ['data', 'status'] }, // 4
          // { field: ['data', 'comments'] }, // 5
          // { field: ['data', 'answerMeta'] }, // 6
          // { field: ['data', 'deleted_at'] }, // 7
          // { field: ['data', 'created_by'] }, // 8
          // { field: ['data', 'updated_at'] }, // 9
          // { field: ['data', 'updated_by'] }, // 10
          // { field: ['ref'] }, // 11
          for (const key in data) {
            const attendee = {
              id: parseInt(key) + 1,
              name: data[key][12],
              created_at: data[key][13],
              ref: data[key][11]['@ref']['id'],
            }
            attendees.push(attendee)
          }

          setdataRows(attendees)
          setIsLoading(false)
        })
        .catch(function (err) {
          console.log(err)
          setErrors(err.response.result.data)
          setIsLoading(false)
        })
    }
  }

  const getProgramProfile = async () => {
    setIsLoading(true)
    const query = router.query

    if (query) {
      const refNumber = query.id
      await getProgramByRef(refNumber)
        .then((program) => {
          const messages = [
            { key: 'Name', value: program.name },
            { key: 'Url', value: program.slug },
            { key: 'Description', value: program.description.toString() },
            { key: 'Short Description', value: program.shortDescription },
            { key: 'Category', value: program.category },
            { key: 'Type', value: program.type },
            { key: 'Delivery Type', value: program.deliveryType },
            { key: 'Program Start Date', value: program.startDt.toString() },
            { key: 'Program End Date', value: program.endDt.toString() },
            {
              key: 'Registration Start Date',
              value: program.registrationStartDt.toString(),
            },

            {
              key: 'Registration End Date',
              value: program.registrationEndDt.toString(),
            },
            { key: 'Status', value: program.status },
            { key: 'Is Featured', value: program.isFeatured },
            { key: 'Price', value: program.price.toString() },
            { key: 'Capacity', value: program.capacity.toString() },
            {
              key: 'Original Capacity',
              value: program.originalCapacity.toString(),
            },
            { key: 'Language', value: program.language },
            { key: 'Link', value: program.link },
            { key: 'Address', value: program.address },
            { key: 'Duration', value: program.duration },

            { key: 'Level', value: program.level },
            { key: 'Image', value: program.imageUrl },
            { key: 'Is Reserved', value: program.isReserved },
            { key: 'Reserved By', value: program.reservedBy },
            { key: 'Reserved At', value: program.reservedAt },
          ]
          setMessages(messages)
          setProgramEndDt(program.endDt.toString())
          setType(program.type)
          setIsLoading(false)
        })
        .catch(function (err) {
          setErrors(err.response.data)
          setIsLoading(false)
        })
    }
  }

  return (
    <>
      <Meta title="View Program | Maven Admin" keywords="" description="" />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-3">
        <h1 className="col-span-2 text-2xl font-semibold text-gray-900">
          View Program
        </h1>
        {type !== 'on-demand' && (
          <>
            <div className="text-right">
              <a
                href={`${server}/products/${router.query.id}/copy`}
                className="w-1/3 px-3 py-2 text-sm font-medium leading-4 text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Copy to On Demand
              </a>
            </div>
          </>
        )}
      </div>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {isLoading && (
            <div className="mx-2">
              <Loader />
            </div>
          )}
          {!isLoading && <ViewComponent name="Program" messages={messages} />}
          {!isLoading && (
            <div className="mt-3">
              <ReactTableView columns={columns} rows={dataRows} />
            </div>
          )}
        </div>
      </div>
      {openPopup && (
        <QuestionAnswerPopup
          open={openPopup}
          closeProp={() => {
            setOpenPopup(false)
          }}
          attendeeRefId={viewQandAId}
        />
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: `${server}/sign-in`,
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default ViewProductPage
