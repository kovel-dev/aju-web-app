import axios from 'axios'
import { server } from 'lib/config/server'

class Page {
  static getPartnerAnalyticUserTabDetails = async () => {
    return await axios
      .get(`${server}/api/pages/get-partner-analytic-user-tab-details`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  static getPartnerAnalyticAddOnTabDetails = async () => {
    return await axios
      .get(`${server}/api/pages/get-partner-analytic-add-on-tab-details`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  static getEarlyAccessPrograms = async () => {
    return await axios
      .get(`${server}/api/pages/get-early-access-programs`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  static getMarketingMaterials = async (search, sort_date, sort_topic) => {
    return await axios
      .post(`${server}/api/pages/get-marketing-materials`, {
        search: search,
        sort_date: sort_date,
        sort_topic: sort_topic,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  static getPartnerSchedules = async (startDt, endDt) => {
    return await axios
      .post(`${server}/api/pages/get-partner-schedules`, {
        startDt: startDt,
        endDt: endDt,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  static getPurchaseHistory = async (startDt, endDt, status) => {
    return await axios
      .post(`${server}/api/pages/get-purchase-history`, {
        startDt: startDt,
        endDt: endDt,
        status: status,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  static getStudentUpcomingEvents = async (startDt, endDt, status) => {
    return await axios
      .post(`${server}/api/pages/get-student-upcoming-events`, {
        startDt: startDt,
        endDt: endDt,
        status: status,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  static getStudentEventsClassesPrograms = async (startDt, endDt, status) => {
    return await axios
      .post(`${server}/api/pages/get-student-events-classes`, {
        startDt: startDt,
        endDt: endDt,
        status: status,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  static getFaqData = async () => {
    return await axios
      .get(`${server}/api/pages/get-faq`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }
}

export default Page
