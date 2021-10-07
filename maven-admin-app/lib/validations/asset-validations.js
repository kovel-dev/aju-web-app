import * as Yup from 'yup'

const AssetSchema = () => {
  let yupObj = {
    upload_file: Yup.mixed()
      .nullable()
      .required({ key: 'upload_file', values: 'The file is required.' })
      .test({
        name: 'fileSize',
        exclusive: false,
        message: { key: 'upload_file', values: 'The file is too large' },
        test: function (value) {
          if (value == null) {
            return true
          }

          if (
            value.type === 'image/jpeg' ||
            value.type === 'image/jpg' ||
            value.type === 'image/png' ||
            value.type == 'application/pdf'
          ) {
            return value && value.size <= 1024 * 1024 * 10
          } else if (value.type === 'video/mp4') {
            return value && value.size <= 1024 * 1024 * 100
          }
        },
      })
      .test({
        name: 'type',
        exclusive: false,
        message: {
          key: 'upload_file',
          values:
            'The file is required with only the accepted formats: .jpeg, .jpg, .png, .mp4, .pdf',
        },
        test: function (value) {
          if (value == null) {
            return true
          }

          return (
            value &&
            (value.type === 'image/jpeg' ||
              value.type === 'image/jpg' ||
              value.type === 'image/png' ||
              value.type === 'video/mp4' ||
              value.type == 'application/pdf')
          )
        },
      }),
  }

  return Yup.object().shape(yupObj)
}

export const validateAssetForm = async (enteredData) => {
  return await AssetSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
