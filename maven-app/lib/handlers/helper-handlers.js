import moment from 'moment'
import axios from 'axios'

export const getToken = () => {
  let length = 7
  let result = ''
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result + moment().format('YYYYMMDDHHmmss')
}

export const trimObj = (obj) => {
  if (!Array.isArray(obj) && typeof obj != 'object') return obj
  return Object.keys(obj).reduce(
    function (acc, key) {
      acc[key.trim()] =
        typeof obj[key] == 'string' ? obj[key].trim() : trimObj(obj[key])
      return acc
    },
    Array.isArray(obj) ? [] : {}
  )
}

export const formatOptions = (options) => {
  let formattedOptions = []

  for (var key in options) {
    formattedOptions.push({
      key: key,
      value: options[key],
    })
  }

  return formattedOptions
}

export const getPublicIdFromURL = (url) => {
  if (!url) {
    return false
  }
  if (url.indexOf('cloudinary') !== -1) {
    let parts = url.split('/')
    let publicId =
      parts[parts.length - 2] +
      '/' +
      parts[parts.length - 1].substring(0, parts[parts.length - 1].indexOf('.'))
    return publicId
  } else {
    return false
  }
}

export const getCloudinaryAsset = async (publicId) => {
  return await axios
    .post(
      `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/assets/get-cloudinary-asset`,
      {
        publicId: publicId,
      }
    )
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw error.response.data
    })
}

export const getSimilarPrograms = async (params) => {
  return await axios
    .post(
      `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/product/similarprograms`,
      params
    )
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw error.response.data
    })
}

export const getProgramHosts = async (params) => {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/product/hosts`, params)
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw error.response.data
    })
}

export const getProgramSeries = async (params) => {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/product/series`, params)
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw error.response.data
    })
}
