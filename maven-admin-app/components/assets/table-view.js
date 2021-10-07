import React, { useMemo } from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Asset from '../../lib/models/asset'
import { server } from '../../lib/config/server'
import ReactTableView from '../../components/shared/table-template'
import AlertModal from '../../components/shared/alert-modal'
import FileUploadInput from './file-upload-input'
import { CloudinaryContext, Image } from 'cloudinary-react'
import { getAssetByRef } from '../../lib/handlers/handlers'
import Meta from '../meta'

function TableView(props) {
  let asset = new Asset({})
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadCount, setloadCount] = useState(0)
  const [dataRows, setdataRows] = useState([])
  const [totalRows, settotalRows] = useState(0)
  const [showDeleteModal, setshowDeleteModal] = useState(false)
  const [showEditModal, setshowEditModal] = useState(false)
  const [toDeleteItem, setToDeleteItem] = useState(null)
  const [toSelectItem, setToSelectItem] = useState(null)
  const [toEditItem, setToEditItem] = useState(null)
  const [value, setValue] = useState(null)
  const [modalState, setModalState] = useState(asset.getValues())
  const [showPDF, setShowPDF] = useState(props.showPDF ? true : false)

  const showAlert = (e, ref) => {
    e.preventDefault()
    setshowDeleteModal(true)
    setToDeleteItem(ref)
  }

  const showAlertEdit = async (e, ref) => {
    e.preventDefault()
    await getAssetByRef(ref)
      .then((altValue) => {
        setValue(altValue.altTag)
        setshowEditModal(true)
        setToEditItem(ref)
      })
      .catch((error) => {
        console.log(error)
        setErrors(error.response.data)
        setIsLoading(true)
      })
  }

  const hideAlert = () => {
    setshowDeleteModal(false)
    setToDeleteItem(null)
    setshowEditModal(false)
    setToEditItem(null)
  }

  const confirmedDeleteHandler = async () => {
    await Asset.delete(toDeleteItem)
      .then(async (response) => {
        await fetchData()
      })
      .catch((error) => {
        console.log(error)
        setErrors(error.response.data)
        setIsLoading(true)
      })

    setshowDeleteModal(false)
    setToDeleteItem(null)
  }

  const confirmedEditHandler = async () => {
    await getAssetByRef(toEditItem)
      .then(async (updatevalue) => {
        updatevalue['altTag'] = value
        asset = new Asset(updatevalue)
        setModalState(asset)
        await Asset.update(toEditItem, updatevalue)
          .then(async (response) => {})
          .catch((error) => {
            setErrors(error.response.data)
            setIsLoading(true)
          })
        setshowEditModal(false)
        setToEditItem(null)
      })
      .catch(function (err) {
        setErrors(err.response.data)
        setIsLoading(false)
        console.log(err)
        return
      })
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Preview',
        // eslint-disable-next-line react/display-name
        Cell: ({ row }) => {
          if (row.original.type == 'pdf') {
            return (
              <img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/images/pdf-icon.png`}
                width="100"
              />
            )
          } else {
            return (
              <CloudinaryContext
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
              >
                <Image publicId={row.original.public_id} width="100" />
              </CloudinaryContext>
            )
          }
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Dimentions (WxH)',
        accessor: 'dimentions',
      },
      {
        Header: 'Link',
        // eslint-disable-next-line react/display-name
        Cell: ({ row }) => (
          <div>
            <a
              href={`${row.original.url}`}
              target="_blank"
              className="text-primary hover:text-primary-dark"
              rel="noreferrer"
            >
              Click to Open Link
            </a>
          </div>
        ),
      },
      {
        Header: 'Uploaded On',
        accessor: 'uploaded_on',
      },
      {
        Header: 'Action',
        Cell: function ActionButtons({ row }) {
          return (
            <div>
              <a
                href=""
                onClick={(e) => showAlert(e, row.original.ref)}
                className={`text-red-500 hover:text-red-700 ${
                  props.isModal ? 'hidden' : ''
                }`}
              >
                Delete
              </a>
              <a
                href=""
                onClick={(e) => showAlertEdit(e, row.original.ref)}
                className={`ml-3 text-blue-600 hover:text-blue-700 ${
                  props.isModal ? 'hidden' : ''
                }`}
              >
                Edit
              </a>
              <a
                href=""
                onClick={(e) => props.setFileLink(e, row.original.url)}
                className={`ml-3 text-blue-600 hover:text-blue-600 ${
                  !props.isModal ? 'hidden' : ''
                }`}
              >
                Select
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
      .get(`${server}/api/assets/all`)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const assets = []
        let counter = 0

        settotalRows(count)
        for (const key in data) {
          const asset = {
            id: parseInt(key) + 1,
            name: data[key][0],
            type: data[key][1],
            dimentions: data[key][4] + ' x ' + data[key][5],
            public_id: data[key][6],
            url: data[key][8],
            uploaded_on: data[key][9],
            ref: data[key][10]['@ref']['id'],
          }

          if (showPDF && data[key][1] == 'pdf') {
            assets.push(asset)
          } else if (data[key][1] !== 'pdf') {
            assets.push(asset)
          }

          counter++
          setloadCount(counter)
        }

        setdataRows(assets)
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
      <Meta title="Assets | Maven Admin" keywords="" description="" />
      <div className="pb-8">
        <FileUploadInput refreshPage={fetchData} />
      </div>
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
      {!isLoading && (
        <ReactTableView
          columns={columns}
          rows={dataRows}
          defaultSortBy={[{ id: 'uploaded_on', desc: true }]}
        />
      )}
      <AlertModal
        show={showDeleteModal}
        title="Delete Asset"
        desc="Are you sure you want to delete this asset? It will be removed permanentaly."
        cancelActionhandler={hideAlert}
        actionHandler={confirmedDeleteHandler}
        actionName="Delete"
      />
      <AlertModal
        show={showEditModal}
        title="Edit Asset Alt Tag"
        // desc="Are you sure you want to delete this asset? It will be removed permanentaly."
        input="true"
        value={value}
        setValue={setValue}
        cancelActionhandler={hideAlert}
        actionHandler={confirmedEditHandler}
        actionName="Edit Alt Tag"
      />
    </>
  )
}

export default TableView
