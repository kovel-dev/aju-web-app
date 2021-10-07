import axios from 'axios'

class Product {
  getProduct = async (id, userId) => {
    return await axios
      .post(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/product/details`, {
        id: id,
        userId: userId,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  getAllProductsbyType = async (type) => {
    return await axios
      .post(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/product/list`, {
        type: type,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  getAllProductsbyFilter = async (params) => {
    return await axios
      .post(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/search/advance-search`, {
        params,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  getAllProductsbySlug = async (slug) => {
    return await axios
      .post(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/product/slug`, {
        slug,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  checkProgramEntitlement = async (programId, userId) => {
    return await axios
      .post(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/product/entitlement`, {
        programId: programId,
        userId: userId,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  OnWaitlist = async (programId, userId) => {
    return await axios
      .post(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/product/waitlist`, {
        programId: programId,
        userId: userId,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }
}

export default Product
