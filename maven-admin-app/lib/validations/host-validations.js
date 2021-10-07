import * as Yup from 'yup'
import Host from '../models/host'

const HostSchema = (host) => {
  let yupObj = {
    name: Yup.string()
      .min(2, { key: 'name', values: 'The field is too short' })
      .max(255, { key: 'name', values: 'The field is too long' })
      .required({ key: 'name', values: 'Name is required' })
      .test(
        'unique',
        { key: 'name', values: 'Name has already been used' },
        async (values) => {
          let status = false
          try {
            await Host.checkNameUniqueness(values).then((result) => {
              let isUniqueToThisHost = true
              if (host['id'] && host['id'].length > 0) {
                result.data.map((item, index) => {
                  let id = item['@ref'].id
                  if (host['id'] !== id) {
                    isUniqueToThisHost = false
                  }
                })
              } else if (result.data.length > 0) {
                isUniqueToThisHost = false
              }

              status = isUniqueToThisHost
            })
          } catch (error) {
            status = false
          }

          return status
        }
      ),
  }

  return Yup.object().shape(yupObj)
}

export const validateHostForm = async (enteredData) => {
  let host = new Host(enteredData)
  host = host.getValues()
  if (enteredData['id'] && enteredData['id'].length > 0) {
    host['id'] = enteredData['id']
  }

  return await HostSchema(host)
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
