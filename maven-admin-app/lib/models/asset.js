import axios from 'axios'
import { server } from '../config/server'
import { validateAssetForm } from '../validations/asset-validations'

class Asset {
  constructor(data) {
    this.upload_file = data.upload_file || null

    this.name = data.name || ''
    this.type = data.type || ''
    this.mime = data.mime || ''
    this.size = data.size || ''
    this.width = data.width || ''
    this.height = data.height || ''
    this.url = data.url || ''
    this.secure_url = data.secure_url || ''
    this.cloudinary_meta = data.cloudinary_meta || ''
    this.altTag = data.altTag || ''
    this.created_at = data.created_at || ''
    this.created_by = data.created_by || ''
    this.updated_at = data.updated_at || ''
    this.updated_by = data.updated_by || ''
  }

  getValues = () => {
    return {
      upload_file: this.upload_file,
      name: this.name,
      type: this.type,
      mime: this.mime,
      size: this.size,
      width: this.width,
      height: this.height,
      url: this.url,
      secure_url: this.secure_url,
      cloudinary_meta: this.cloudinary_meta,
      altTag: this.altTag,
      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
    }
  }

  validate = async () => {
    return await validateAssetForm(this.getValues())
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }

  save = async () => {
    await this.validate()

    let validatedFile = this.getValues()

    let formData = new FormData()
    formData.append(
      'upload_file',
      validatedFile.upload_file,
      validatedFile.upload_file.name
    )

    return await axios
      .post(`${server}/api/assets/process`, formData)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  getList = async (pageNumber, limit) => {
    return await axios
      .get(`${server}/api/assets/list?page=${pageNumber}&limit=${limit}`)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const assets = []

        for (const key in data) {
          const asset = {
            id: key,
            name: data[key][0],
            type: data[key][1].toUpperCase(),
            mime: data[key][2].toUpperCase(),
            size: data[key][3],
            width: data[key][4],
            height: data[key][5],
            url: data[key][6],
            secure_url: data[key][7],
            created_at: data[key][8],
            ref: data[key][9]['@ref']['id'],
          }

          assets.push(asset)
        }

        return {
          data: assets,
          count: count,
        }
      })
      .catch(function (error) {
        throw error
      })
  }

  static delete = async (refNumber) => {
    return await axios
      .delete(`${server}/api/assets/${refNumber}/delete`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  }

  static update = async (refNumber, modalState) => {
    return await axios
      .post(`${server}/api/assets/${refNumber}/edit`, {
        value: modalState,
        refNumber: refNumber,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }
}

export default Asset
