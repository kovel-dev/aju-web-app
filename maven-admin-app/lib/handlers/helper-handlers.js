import moment from 'moment'

export const getToken = (length = 7, withDate = true) => {
  let result = ''
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  let salt = withDate
    ? moment().format('YYYYMMDDHHmmss')
    : moment().format('mmss')

  return result + salt
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

export const sessionOptions = () => {
  let options = []
  for (let i = 1; i <= 15; i++) {
    options.push({ key: i, value: i })
  }
  return options
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

export const formatWithLabelAndValueOptions = (options) => {
  let formattedOptions = []
  let arrayResData = options.data

  for (var key in arrayResData) {
    let item = arrayResData[key]

    formattedOptions.push({
      key: item.value,
      value: item.label,
    })
  }

  return formattedOptions
}

export const formatProgramsCardData = async (resultSet, seperate = false) => {
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_API_URL
  let finalResultSet = []
  if (resultSet.length > 0) {
    if (seperate) {
      //Divide resultset into events,classes and on-demands
    } else {
      resultSet.map((program) => {
        let tempProg = {}
        tempProg['title'] = program['title']
        tempProg['img'] = program['img']
        tempProg['link'] =
          FRONTEND_URL + '/events-classes/program/' + program['link']
        tempProg['description'] = program['description']

        if (program['type'] == 'event' || program['type'] == 'class') {
          tempProg['month'] = moment(program['eventStartDate']).format('MMM')
          tempProg['day'] = moment(program['eventStartDate']).format('DD')
          tempProg['free'] = parseInt(program['price']) < 1 ? true : false
        } else if (program['type'] == 'on-demand') {
          //on-demand parameters
        } else {
          //class or series
          // tempProg['label'] = 'select'
        }
        finalResultSet.push(tempProg)
      })
      return finalResultSet
    }
  } else {
    return []
  }
}
