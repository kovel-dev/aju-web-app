import axios from 'axios'
import { server } from 'lib/config/server'

class Cart {
  addToCart = async (slug) => {
    return await axios
      .post(`${server}/api/cart/add-to-cart`, {
        slug: slug,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  updateCart = async (productId, quantity) => {
    return await axios
      .post(`${server}/api/cart/update-cart`, {
        productId: productId,
        quantity: quantity,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  checkAvailability = async (promoCodes) => {
    return await axios
      .post(`${server}/api/cart/check-availability`, {
        promoCodes: promoCodes,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  checkout = async (
    isSubscribe,
    promoCodes,
    payAmount,
    cardHolderName,
    transactionId,
    answers
  ) => {
    return await axios
      .post(`${server}/api/cart/checkout`, {
        isSubscribe: isSubscribe,
        promoCodes: promoCodes,
        payAmount: payAmount,
        cardHolderName: cardHolderName,
        transactionId: transactionId,
        answers: answers,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  verifyPromoCode = async (promoCode) => {
    return await axios
      .post(`${server}/api/cart/verify-promo-code`, {
        promoCode: promoCode,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  getConfirmationRecord = async (orderId, slug) => {
    return await axios
      .post(`${server}/api/cart/get-confirmation-details`, {
        orderId: orderId,
        slug: slug,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  joinWaitList = async (slug) => {
    return await axios
      .post(`${server}/api/cart/join-waitlist`, {
        slug: slug,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error.response.data
      })
  }
}

export default Cart
